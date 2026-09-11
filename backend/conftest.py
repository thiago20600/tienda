import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

import pytest
from fastapi.testclient import TestClient
from sqlalchemy.pool import StaticPool
from sqlmodel import Session, SQLModel, create_engine

from database.engine import get_session
from main import app
from models.categorias import Categoria
from models.productos import Producto
from utils.auth import get_current_user

EMAIL_CLIENTE = 'cliente@test.com'
EMAIL_ADMIN = 'admin@test.com'

PERMISOS_CLIENTE = [
    'carrito:read:own',
    'carrito:create:own',
    'carrito:update:own',
    'carrito:delete:own',
    'pedidos:create:own',
    'pedidos:read:own',
    'favoritos:read:own',
    'favoritos:write:own',
]

PERMISOS_ADMIN = PERMISOS_CLIENTE + [
    'productos:read:admin',
    'productos:create:admin',
    'productos:update:admin',
    'productos:delete:admin',
    'pedidos:read:admin',
    'pedidos:update:admin',
]


@pytest.fixture
def engine():
    engine = create_engine(
        'sqlite://',
        connect_args={'check_same_thread': False},
        poolclass=StaticPool,
    )
    SQLModel.metadata.create_all(engine)
    yield engine
    engine.dispose()


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


@pytest.fixture
def client(engine, usuario_actual):
    app.dependency_overrides[get_session] = _override_session(engine)
    app.dependency_overrides[get_current_user] = lambda: usuario_actual
    yield TestClient(app)
    app.dependency_overrides.clear()


@pytest.fixture
def client_sin_auth(engine):
    app.dependency_overrides[get_session] = _override_session(engine)
    app.dependency_overrides.pop(get_current_user, None)
    yield TestClient(app)
    app.dependency_overrides.clear()


@pytest.fixture
def seed(session):
    categoria = Categoria(nombre='Futbol')
    session.add(categoria)

    def crear_producto(nombre, precio, stock, **kwargs):
        producto = Producto(
            nombre=nombre,
            precio=precio,
            stock=stock,
            user_email=EMAIL_ADMIN,
            categoria=[categoria],
            **kwargs,
        )
        session.add(producto)
        return producto

    datos = {
        'categoria': categoria,
        'camiseta': crear_producto('Camiseta', 100.0, 10),
        'pelota': crear_producto('Pelota', 50.0, 5, precio_descuento=40.0),
        'botines': crear_producto('Botines', 200.0, 3, producto_activo=False),
        'red': crear_producto('Red', 30.0, 2),
    }
    session.commit()
    for producto in (datos['camiseta'], datos['pelota'], datos['botines'], datos['red']):
        session.refresh(producto)
    return datos
