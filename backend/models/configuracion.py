from sqlmodel import Field, SQLModel, Column, JSON


class ConfiguracionGeneral(SQLModel, table=True):
    id: int = Field(default=1, primary_key=True)
    nombre_tienda: str = Field(default="Mi Tienda")
    logo_url: str | None = Field(default=None)
    emails_contacto: list[str] = Field(default_factory=list, sa_column=Column(JSON))
    numeros_contacto: list[str] = Field(default_factory=list, sa_column=Column(JSON))
    color_primario: str = Field(default="#009ee3")
    color_secundario: str = Field(default="#0081b8")


class ConfiguracionPublic(SQLModel):
    id: int
    nombre_tienda: str
    logo_url: str | None
    emails_contacto: list[str]
    numeros_contacto: list[str]
    color_primario: str
    color_secundario: str


class ConfiguracionUpdate(SQLModel):
    nombre_tienda: str | None = None
    logo_url: str | None = None
    emails_contacto: list[str] | None = None
    numeros_contacto: list[str] | None = None
    color_primario: str | None = None
    color_secundario: str | None = None
