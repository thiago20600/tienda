from datetime import date, datetime, timezone
from sqlmodel import Field, Relationship, SQLModel, Column, JSON
from models.links import ProductosCategoriaLink


class Categoria(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    nombre: str
    imagen_url: list[str] | None = Field(default_factory=list, sa_column=Column(JSON), max_length=5)
    producto: list['Producto'] = Relationship(back_populates='categoria', link_model=ProductosCategoriaLink)
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime | None = Field(default=None)
    estado: bool = Field(default=True)
    destacado: bool = Field(default=False)


class CategoriaPublic(SQLModel):
    id: int
    nombre: str
    imagen_url: list[str] | None = None
    estado: bool
    destacado: bool
    created_at: datetime


class CategoriaCreate(SQLModel):
    nombre: str
    imagen_url: list[str] | None = None
class CategoriaUpdate(SQLModel):
    nombre: str | None = None
    imagen_url: list[str] | None = None
    estado: bool | None = None
    destacado: bool | None = None
