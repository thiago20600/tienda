from datetime import datetime, timezone
from decimal import Decimal
from enum import Enum
import uuid
from pydantic import field_serializer
from sqlmodel import JSON, Column, Field, Relationship, SQLModel
from models.productos import Producto, ProductoPublic
from sqlalchemy.dialects.postgresql import JSONB

class MetodoPago(str, Enum):
    tarjeta = 'tarjeta'
    efectivo = 'efectivo'


class EstadoPedido(str, Enum):
    pendiente = 'pendiente'         
    pagado = 'pagado'               
    en_proceso = 'en_proceso'     
    en_camino = 'en_camino'         
    entregado = 'entregado'       
    rechazado = 'rechazado'
    cancelado = 'cancelado'     
    

class Pedido(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    numero_pedido: str | None = Field(default=None, unique=True)
    carrito_id: int = Field(foreign_key="carrito.id")
    carrito: 'Carrito' = Relationship(back_populates='pedido')
    estado: EstadoPedido = Field(default=EstadoPedido.pendiente)
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime | None = Field(default=None)
    canceled_at: datetime | None = Field(default=None)
    entregado_at: datetime | None = Field(default=None)
    user_email: str
    comentarios: str | None = None
    updated_by_email: str | None = None
    #productos: list['Producto'] = Relationship(back_populates="pedidos", link_model=PedidoProductoLink)
    detalles: list['DetallePedido'] = Relationship(back_populates='pedido')
    metodo_pago: MetodoPago
    precio_total: Decimal
    idempotency_key: str = Field(default_factory=lambda: str(uuid.uuid4()))
    mp_payment_id: str | None = Field(default=None)
    mp_response_raw: dict | None = Field(default=None, sa_column=Column(JSONB().with_variant(JSON(), "sqlite")))
    


class DetallePedido(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    pedido_id: int = Field(foreign_key='pedido.id')
    pedido: 'Pedido' = Relationship(back_populates='detalles')
    producto_id: int = Field(foreign_key='producto.id')
    producto: 'Producto' = Relationship()
    cantidad: int = Field(gt=0)
    precio_unitario: Decimal = Field(gt=0)
    subtotal: Decimal = Field(gt=0)


class DetallePedidoPublic(SQLModel):
    id: int
    cantidad: int
    precio_unitario: Decimal
    subtotal: Decimal
    producto: ProductoPublic

    @field_serializer('precio_unitario', 'subtotal', when_used='json')
    def serializar_precio(self, valor: Decimal) -> float:
        return float(valor)


class PedidoPublic(SQLModel):
    id: int
    numero_pedido: str | None
    estado: EstadoPedido
    metodo_pago: MetodoPago
    precio_total: Decimal
    created_at: datetime
    comentarios: str | None = None
    detalles: list[DetallePedidoPublic] = []
    mp_payment_id: str | None = Field(default=None)
    mp_response_raw: dict | None = None
    user_email: str

    @field_serializer('precio_total', when_used='json')
    def serializar_precio_total(self, valor: Decimal) -> float:
        return float(valor)


class PedidoClientePublic(SQLModel):
    id: int
    numero_pedido: str | None
    estado: EstadoPedido
    metodo_pago: MetodoPago
    precio_total: Decimal
    created_at: datetime
    comentarios: str | None = None
    detalles: list[DetallePedidoPublic] = []

    @field_serializer('precio_total', when_used='json')
    def serializar_precio_total(self, valor: Decimal) -> float:
        return float(valor)


class PedidoUpdate(SQLModel):
    estado: EstadoPedido | None = None
    comentarios: str | None = None