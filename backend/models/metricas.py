from typing import Optional

from sqlmodel import SQLModel


class ConteoPorEstado(SQLModel):
    estado: str
    total: int


class ProductoTop(SQLModel):
    producto_id: int
    nombre: str
    unidades: int
    imagen_url: Optional[list[str]] = None


class StockBajoItem(SQLModel):
    id: int
    nombre: str
    stock: int
    imagen_url: Optional[list[str]] = None


class MetricasPublic(SQLModel):
    total_pedidos: int
    ingresos: float
    pedidos_por_estado: list[ConteoPorEstado] = []
    top_productos: list[ProductoTop] = []
    stock_bajo: list[StockBajoItem] = []
    productos_total: int
    categorias_total: int