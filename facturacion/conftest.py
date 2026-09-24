import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

# Variables de entorno para los tests: se setean ANTES de importar config/main.
# Se usa localhost:1 para que el intento de sync de permisos falle al instante (connection refused).
# Asignacion DIRECTA (no setdefault): aca no debe filtrarse ninguna DB_URL heredada del sistema.
os.environ['DB_URL'] = 'sqlite://'
os.environ.setdefault('POSTGRES_USER', 'test')
os.environ.setdefault('POSTGRES_DB', 'test')
os.environ.setdefault('POSTGRES_PASSWORD', 'test')
os.environ.setdefault('SECRET_KEY_JWT', 'test-secret')
os.environ.setdefault('ALGORITHM', 'HS256')
os.environ.setdefault('API_USUARIOS_URL', 'http://localhost:1')
os.environ.setdefault('TOKEN_SERVICIO_INTERNO_API', 'test-internal-key')
os.environ.setdefault('AFIP_CUIT', '20111111112')
os.environ.setdefault('AFIP_CERT_PATH', 'certificado-test.crt')
os.environ.setdefault('AFIP_KEY_PATH', 'clave-test.key')
os.environ.setdefault('AFIP_AMBIENTE', 'homologacion')

from datetime import date, datetime, timedelta, timezone
from decimal import Decimal

import pytest
from fastapi.testclient import TestClient
from sqlalchemy.pool import StaticPool
from sqlmodel import Session, SQLModel, create_engine, select

from config import settings
from database.engine import get_session
from main import app
from models.factura import EstadoFactura, Factura
from router.factura import facturacion_service
from services.afip_client import (
    AfipErrorDefinitivo,
    AfipErrorNumeroInvalido,
    AfipErrorTransitorio,
    ResultadoCae,
)
from utils.auth import get_current_user

EMAIL_CLIENTE = 'cliente@test.com'
EMAIL_ADMIN = 'admin@test.com'

PERMISOS_CLIENTE = ['facturas:read:own']

PERMISOS_ADMIN = PERMISOS_CLIENTE + [
    'facturas:read:admin',
    'facturas:update:admin',
]

INTERNAL_HEADERS = {'X-Internal-Key': settings.TOKEN_SERVICIO_INTERNO_API}


def payload_pedido_pagado(pedido_id: int = 1, **kwargs) -> dict:
    """Payload del evento que dispara api_tienda cuando un pedido queda pagado."""
    datos = {
        'pedido_id': pedido_id,
        'numero_pedido': f'pedido-{pedido_id}',
        'user_email': EMAIL_CLIENTE,
        'metodo_pago': 'tarjeta',
        # precio_total == suma de subtotales (ambos con IVA incluido, igual que en la tienda)
        'precio_total': '121000.00',
        'detalles': [
            {
                'producto_id': 1,
                'descripcion': 'Camiseta',
                'cantidad': 1,
                'precio_unitario': '121000.00',
                'subtotal': '121000.00',
            },
        ],
    }
    datos.update(kwargs)
    return datos


class ClienteAfipFalso:
    """Doble de prueba de `services.afip_client.AfipCliente`.

    Simula los tres contactos con ARCA por separado: la consulta del correlativo
    (`obtener_ultimo_comprobante`), la reconciliacion (`consultar_comprobante`) y la
    solicitud del CAE (`solicitar_cae`), para poder testear carreras y crashes.
    """

    def __init__(
        self,
        ultimo_comprobante: int = 0,
        error: Exception | None = None,
        error_ultimo: Exception | None = None,
        error_cae: Exception | None = None,
        autorizados: dict | None = None,
    ):
        self.ultimo_comprobante = ultimo_comprobante
        self.error_ultimo = error_ultimo if error_ultimo is not None else error
        self.error_cae = error_cae if error_cae is not None else error
        # numero -> ResultadoCae: comprobantes que ARCA ya autorizo (reconciliacion)
        self.autorizados = autorizados or {}
        self.llamadas = 0
        self.consultas = 0

    def obtener_ultimo_comprobante(self, punto_de_venta: int, tipo_comprobante: int) -> int:
        if self.error_ultimo is not None:
            raise self.error_ultimo
        return self.ultimo_comprobante

    def consultar_comprobante(self, punto_de_venta: int, tipo_comprobante: int, numero_comprobante: int):
        self.consultas += 1
        return self.autorizados.get(numero_comprobante)

    def solicitar_cae(self, datos, numero_comprobante: int) -> ResultadoCae:
        self.llamadas += 1
        if self.error_cae is not None:
            raise self.error_cae
        return ResultadoCae(
            cae='75000000000000',
            vencimiento_cae=date(2026, 10, 1),
            numero_comprobante=numero_comprobante,
        )


class ClienteCarreraDeNumero(ClienteAfipFalso):
    """Simula la carrera sobre el correlativo: la primera solicitud es rechazada por
    numero invalido y, al re-consultar, el ultimo comprobante ya crecio (otra instancia
    emitio entre medio). El service debe reintentar con el numero fresco."""

    def __init__(self):
        super().__init__(ultimo_comprobante=5)

    def obtener_ultimo_comprobante(self, punto_de_venta: int, tipo_comprobante: int) -> int:
        if self.llamadas:
            # Entre la primera asignacion y la re-consulta, otra instancia emitio uno mas
            self.ultimo_comprobante += 1
        return self.ultimo_comprobante

    def solicitar_cae(self, datos, numero_comprobante: int) -> ResultadoCae:
        self.llamadas += 1
        if self.llamadas == 1:
            raise AfipErrorNumeroInvalido('(10021) El numero de comprobante no es valido')
        return ResultadoCae(
            cae='75000000000000',
            vencimiento_cae=date(2026, 10, 1),
            numero_comprobante=numero_comprobante,
        )


@pytest.fixture
def engine():
    motor = create_engine(
        'sqlite://',
        connect_args={'check_same_thread': False},
        poolclass=StaticPool,
    )
    SQLModel.metadata.create_all(motor)
    yield motor
    motor.dispose()


@pytest.fixture
def session(engine):
    with Session(engine) as session:
        yield session


@pytest.fixture
def usuario_actual():
    return {'email': EMAIL_CLIENTE, 'rol': 'cliente', 'permisos': list(PERMISOS_CLIENTE)}


def _override_session(engine):
    def override():
        with Session(engine) as session:
            yield session

    return override


def _usar_engine_de_test(engine):
    """La emision corre en BackgroundTasks contra el engine del servicio: se apunta al de test."""
    engine_original = facturacion_service.engine
    facturacion_service.engine = engine
    return engine_original


@pytest.fixture
def client(engine, usuario_actual):
    """Cliente autenticado como cliente (permisos de `PERMISOS_CLIENTE`)."""
    app.dependency_overrides[get_session] = _override_session(engine)
    app.dependency_overrides[get_current_user] = lambda: usuario_actual

    engine_original = _usar_engine_de_test(engine)
    yield TestClient(app)

    facturacion_service.engine = engine_original
    app.dependency_overrides.clear()


@pytest.fixture
def client_admin(engine):
    """Cliente autenticado como admin."""
    app.dependency_overrides[get_session] = _override_session(engine)
    app.dependency_overrides[get_current_user] = lambda: {
        'email': EMAIL_ADMIN, 'rol': 'admin', 'permisos': list(PERMISOS_ADMIN),
    }

    engine_original = _usar_engine_de_test(engine)
    yield TestClient(app)

    facturacion_service.engine = engine_original
    app.dependency_overrides.clear()


@pytest.fixture
def client_sin_auth(engine):
    app.dependency_overrides[get_session] = _override_session(engine)
    app.dependency_overrides.pop(get_current_user, None)

    engine_original = _usar_engine_de_test(engine)
    yield TestClient(app)

    facturacion_service.engine = engine_original
    app.dependency_overrides.clear()


@pytest.fixture
def arca_aprobado(monkeypatch):
    """ARCA responde OK. El ultimo comprobante autorizado es 0, asi que emite el 1."""
    cliente = ClienteAfipFalso(ultimo_comprobante=0)
    monkeypatch.setattr(facturacion_service, 'cliente_factory', lambda: cliente)
    return cliente


@pytest.fixture
def arca_error_transitorio(monkeypatch):
    """ARCA no responde (timeout): la factura queda pendiente para reintentar."""
    cliente = ClienteAfipFalso(error=AfipErrorTransitorio('timeout de ARCA'))
    monkeypatch.setattr(facturacion_service, 'cliente_factory', lambda: cliente)
    return cliente


@pytest.fixture
def arca_rechazo(monkeypatch):
    """ARCA rechaza el comprobante por un error FISCAL definitivo (no de correlativo):
    obtener_ultimo funciona, pero createVoucher es rechazado. No se reintenta."""
    cliente = ClienteAfipFalso(error_cae=AfipErrorDefinitivo('(10057) Los importes no coinciden con los detalles del comprobante'))
    monkeypatch.setattr(facturacion_service, 'cliente_factory', lambda: cliente)
    return cliente


@pytest.fixture
def arca_carrera_de_numero(monkeypatch):
    """ARCA rechaza el primer numero por carrera sobre el correlativo; el service debe
    re-consultar el ultimo y emitir con el numero fresco."""
    cliente = ClienteCarreraDeNumero()
    monkeypatch.setattr(facturacion_service, 'cliente_factory', lambda: cliente)
    return cliente


@pytest.fixture
def arca_ya_autorizado(monkeypatch):
    """Simula el crash post-ARCA: el comprobante 3 ya fue autorizado (tiene CAE) pero
    el proceso murio antes de guardar. La reconciliacion debe recuperarlo sin emitir
    un segundo comprobante."""
    cliente = ClienteAfipFalso(ultimo_comprobante=0)
    cliente.autorizados = {3: ResultadoCae('88800000000000', date(2026, 10, 1), 3)}
    monkeypatch.setattr(facturacion_service, 'cliente_factory', lambda: cliente)
    return cliente


@pytest.fixture
def headers_internos():
    """Header service-to-service con el token interno configurado."""
    return {'X-Internal-Key': settings.TOKEN_SERVICIO_INTERNO_API}


@pytest.fixture
def payload_pedido():
    """Factory del payload del evento "pedido pagado"."""
    def _payload(**kwargs):
        return payload_pedido_pagado(**kwargs)

    return _payload


@pytest.fixture
def crear_factura(engine):
    """Inserta una factura en estado pendiente con los datos minimos (sin llamar a ARCA)."""
    def _crear(pedido_id: int, user_email: str = EMAIL_CLIENTE, **kwargs):
        with Session(engine) as session:
            factura = Factura(
                pedido_id=pedido_id,
                numero_pedido=f'pedido-{pedido_id}',
                user_email=user_email,
                estado=kwargs.pop('estado', EstadoFactura.pendiente),
                monto_neto=Decimal('100000.00'),
                monto_iva=Decimal('21000.00'),
                monto_total=Decimal('121000.00'),
                **kwargs,
            )
            session.add(factura)
            session.commit()
            session.refresh(factura)
        return factura

    return _crear


@pytest.fixture
def factura_pendiente(crear_factura):
    """Factura propia del cliente en estado pendiente."""
    return crear_factura(pedido_id=99)


@pytest.fixture
def consultar_facturas(engine):
    """Lee las facturas con una sesion nueva y corta (evita estados cacheados)."""
    def _consultar():
        with Session(engine) as session:
            return session.exec(select(Factura)).all()

    return _consultar

