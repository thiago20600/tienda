from datetime import date, datetime, timezone
from decimal import Decimal
from enum import Enum

from sqlalchemy import Column, Numeric, UniqueConstraint
from sqlalchemy.dialects.postgresql import JSONB
from sqlmodel import JSON, Field, SQLModel


class EstadoFactura(str, Enum):
    """Ciclo de vida de la emision del comprobante.

    - `pendiente`: registrada, esperando un worker que la procese.
    - `procesando`: un worker la reclamo (claim atomico) y esta llamando a ARCA.
      Si el proceso muere aca, el reclamo vence por timeout y otra instancia la recupera.
    - `aprobada`: ARCA devolvio el CAE. Datos fiscales congelados (inmutables).
    - `rechazada`: ARCA rechazo el comprobante (error fiscal definitivo). No se reintenta.
    - `error`: se agotaron los reintentos ante errores tecnicos/transitorios (timeout, red).
      Un error tecnico NO es un rechazo fiscal: se distinguen para que el area fiscal
      sepa que `rechazada` exige correccion de datos y `error` solo reintentar.
    """

    pendiente = 'pendiente'
    procesando = 'procesando'
    aprobada = 'aprobada'
    rechazada = 'rechazada'
    error = 'error'


class TipoComprobante(int, Enum):
    factura_a = 1
    factura_b = 6
    factura_c = 11


class TipoDocumento(int, Enum):
    cuit = 80
    dni = 96
    sin_identificar = 99


class Factura(SQLModel, table=True):
    """Comprobante electronico emitido ante ARCA (ex AFIP).

    Es la "foto" contable del pedido: guarda los montos del momento del pago, no los del
    pedido actual. El indice unico sobre `pedido_id` garantiza la idempotencia fiscal
    (un pedido se factura una sola vez).
    """

    __tablename__ = 'factura'

    # El numero de comprobante pertenece al circuito fiscal de ARCA: la unicidad
    # (punto de venta, tipo, numero) evita que dos workers/instancias persistan el
    # mismo comprobante, incluso en despliegues con varias replicas.
    __table_args__ = (
        UniqueConstraint('punto_de_venta', 'tipo_comprobante', 'numero_comprobante', name='uq_factura_comprobante'),
    )

    id: int | None = Field(default=None, primary_key=True)

    # 1. Correlacion con la tienda (idempotencia interna)
    pedido_id: int = Field(index=True, unique=True)
    numero_pedido: str = Field(index=True)
    user_email: str = Field(index=True)

    # 2. Estado del ciclo de vida y reintentos
    estado: EstadoFactura = Field(default=EstadoFactura.pendiente, index=True)
    intentos: int = Field(default=0)
    ultimo_error: str | None = Field(default=None)
    proximo_intento: datetime | None = Field(default=None)

    # 3. Datos asignados por ARCA (nulos mientras la factura esta pendiente).
    #    `numero_comprobante` se persiste ANTES de llamar a ARCA: es la clave que permite
    #    reconciliar (consultar si ARCA lo autorizo) cuando el proceso muere a mitad de camino.
    cae: str | None = Field(default=None, index=True)
    vencimiento_cae: date | None = Field(default=None)
    numero_comprobante: int | None = Field(default=None, index=True)
    punto_de_venta: int = Field(default=1)
    tipo_comprobante: int = Field(default=TipoComprobante.factura_b.value)  # 1=A, 6=B, 11=C

    # 4. Datos del cliente / receptor
    doc_tipo: int = Field(default=TipoDocumento.sin_identificar.value)  # 80=CUIT, 96=DNI, 99=Sin identificar
    doc_numero: str = Field(default='0')
    razon_social: str = Field(default='Consumidor Final', max_length=200)

    # 5. Montos de la operacion (Decimal, nunca float)
    monto_neto: Decimal = Field(default=Decimal('0'), sa_column=Column(Numeric(12, 2), nullable=False))
    monto_iva: Decimal = Field(default=Decimal('0'), sa_column=Column(Numeric(12, 2), nullable=False))
    monto_total: Decimal = Field(default=Decimal('0'), sa_column=Column(Numeric(12, 2), nullable=False))

    # 5.b Desglose fiscal por alicuota (para Factura A con IVA mixto): lista de
    #     {'alicuota': '21.00', 'base_imponible': '100.00', 'importe': '21.00'} con los
    #     montos serializados como str (JSON no soporta Decimal). Snapshot inmutable
    #     desde la autorizacion, igual que los montos.
    desglose_iva: list | None = Field(default=None, sa_column=Column(JSONB().with_variant(JSON(), 'sqlite')))

    # 6. Snapshot de los items del pedido (JSONB en postgres, JSON en sqlite; igual que Pedido.mp_response_raw)
    detalles: list | None = Field(default=None, sa_column=Column(JSONB().with_variant(JSON(), 'sqlite')))

    # 7. Auditoria interna
    #    - created_at: cuando el microservicio REGISTRO la factura (llegada del evento).
    #    - fecha_emision: cuando ARCA AUTORIZO el comprobante (llegada del CAE).
    #    Son eventos distintos y se mantienen independientes.
    fecha_emision: datetime | None = Field(default=None)
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
