from sqlmodel import Field, SQLModel
from sqlalchemy import Column, ForeignKey

#sirve como tabla intermedia

class ProductosCategoriaLink(SQLModel, table=True):
    producto_id: int = Field(
        sa_column= Column(ForeignKey("producto.id", ondelete="CASCADE"), primary_key=True)
    )
    categoria_id: int = Field(
        sa_column=Column(ForeignKey("categoria.id", ondelete="CASCADE"), primary_key=True)
    )