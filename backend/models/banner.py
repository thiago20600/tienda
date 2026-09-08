import datetime

from sqlmodel import Field, SQLModel


class Banner(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    imagen: str = Field(max_length=500)  # URL de la imagen
    enlace: str = Field(max_length=500)  # URL a donde redirige
    activo: bool = Field(default=True)
    titulo: str = Field(max_length=100)
    titulo_boton: str = Field(max_length=50, default="Ver más")
    boton_color: str = Field(max_length=20, default="#2563eb")  # Color en hex (ej: #2563eb)
    created_at: datetime = Field(default_factory=lambda: datetime.now(datetime.timezone.utc))
    updated_at: datetime | None = None


class BannerCreate(SQLModel):
    imagen: str
    enlace: str
    titulo: str
    titulo_boton: str = "Ver más"
    boton_color: str = "#2563eb"
    activo: bool = True


class BannerUpdate(SQLModel):
    imagen: str | None = None
    enlace: str | None = None
    titulo: str | None = None
    titulo_boton: str | None = None
    boton_color: str | None = None
    activo: bool | None = None

class BannerPublic(SQLModel):
    id: int
    imagen: str
    enlace: str
    activo: bool
    titulo: str
    titulo_boton: str
    boton_color: str
    created_at: datetime
    updated_at: datetime | None = None