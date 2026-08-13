from datetime import date, datetime, timezone
from sqlmodel import Field, Relationship,SQLModel
from models.links import ProductosCategoriaLink


class Categoria(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    nombre: str
    producto: list['Producto'] = Relationship(back_populates='categoria', link_model=ProductosCategoriaLink)
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime | None = Field(default=None)
    estado: bool = Field(default=True)


class CategoriaPublic(SQLModel):
    id: int
    nombre: str
    estado: bool
    created_at: datetime


class CategoriaCreate(SQLModel):
    nombre: str


class CategoriaUpdate(SQLModel):
    nombre: str | None = None
    estado: bool | None = None