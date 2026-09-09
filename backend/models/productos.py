from sqlmodel import JSON, Column, Field, Relationship,SQLModel
from models.categorias import Categoria, CategoriaPublic
from models.links import ProductosCategoriaLink
from datetime import date, datetime, timezone
from enum import Enum


class Producto(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    nombre: str = Field(index=True)
    categoria: list['Categoria'] | None = Relationship(back_populates='producto', link_model=ProductosCategoriaLink)
    sku: int | None = Field(default=None, index=True)
    precio: float = Field(gt=0, index=True)
    stock: int = Field(ge=0, index=True)
    descripcion: str | None = Field(default=None, max_length=1200)
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime | None = Field(default=None)
    user_email: str
    items: list['CarritoItem'] = Relationship(back_populates="producto")
    imagen_url: list[str] | None = Field(default_factory=list, sa_column=Column(JSON), max_length=5)
    producto_activo: bool = Field(default=True)
    eliminado_at: datetime | None = Field(default=None)
    precio_descuento: float | None = Field(gt=0, index=True)
    destacado: bool = Field(default=False)



class ProductoPublic(SQLModel):
    id: int
    nombre: str
    categoria: list[CategoriaPublic] = []
    precio: float
    sku: int | None = None
    stock: int
    descripcion: str | None = None
    imagen_url: list[str] = []
    producto_activo: bool
    precio_descuento: float | None = None
    destacado: bool


class ProductCreate(SQLModel):
    nombre: str
    categoria: list[int]
    sku: int | None
    precio: float
    precio_descuento: float | None = None
    stock: int
    descripcion: str | None



class ProductUpdate(SQLModel):
    nombre: str | None = None
    categoria: list[int] | None = None
    sku: int | None = None
    precio: float | None = None
    stock: int | None = None
    descripcion: str | None = None
    imagen_url: list[str] | None = None
    producto_activo: bool | None = None
    precio_descuento: float | None = None
    destacado: bool | None = None
