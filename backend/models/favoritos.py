from datetime import datetime, timezone

from sqlalchemy import UniqueConstraint
from sqlmodel import Field, Relationship, SQLModel

from models.productos import Producto, ProductoPublic


class Favorito(SQLModel, table=True):
    __table_args__ = (
        UniqueConstraint('user_email', 'producto_id', name='uq_favorito_usuario_producto'),
    )

    id: int | None = Field(default=None, primary_key=True)
    user_email: str = Field(index=True)
    producto_id: int = Field(foreign_key='producto.id', index=True)
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    producto: Producto = Relationship()


class FavoritoPublic(SQLModel):
    id: int
    producto_id: int
    producto: ProductoPublic
