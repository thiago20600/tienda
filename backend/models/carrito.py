from datetime import datetime, timezone
from decimal import Decimal
from pydantic import computed_field, field_serializer, model_validator
from sqlmodel import Field, Relationship, SQLModel
from enum import Enum

from models.pedido import MetodoPago
from models.productos import ProductoPublic


class EstadoCarrito(Enum):
    abierto = 'abierto'
    confirmado = 'confirmado'
    cancelado = 'cancelado'


class Carrito(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    user_email: str
    estado: EstadoCarrito = Field(default=EstadoCarrito.abierto)
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime | None = Field(default=None)
    items: list['CarritoItem'] = Relationship(back_populates='carrito')
    pedido: 'Pedido' = Relationship(back_populates='carrito')
    


class CarritoItem(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    carrito_id: int = Field(foreign_key='carrito.id')
    carrito: 'Carrito' = Relationship(back_populates='items')
    producto_id: int = Field(foreign_key='producto.id')
    producto: 'Producto' = Relationship(back_populates='items')
    cantidad: int = Field(default=1)
    precio_unitario: Decimal = Field(gt=0)


class CarritoItemPublic(SQLModel):
    id: int
    producto_id: int
    cantidad: int
    precio_unitario: Decimal
    producto: ProductoPublic

    @computed_field
    def subtotal(self) -> Decimal:
        return self.precio_unitario * self.cantidad

    @field_serializer('precio_unitario', 'subtotal', when_used='json')
    def serializar_precio(self, valor: Decimal) -> float:
        return float(valor)


class CarritoPublic(SQLModel):
    id: int
    user_email: str
    estado: EstadoCarrito
    created_at: datetime
    items: list[CarritoItemPublic]
    total: Decimal = Decimal("0")

    @model_validator(mode='after')
    def calcular_total(self):
        self.total = sum((item.cantidad * item.precio_unitario for item in self.items), Decimal("0"))
        return self

    @field_serializer('total', when_used='json')
    def serializar_total(self, valor: Decimal) -> float:
        return float(valor)
    

class CarritoItemUpdate(SQLModel):
    cantidad: int = Field(gt=0)


class ConfirmarCarrito(SQLModel):
    metodo_pago: MetodoPago
