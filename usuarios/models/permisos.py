from sqlmodel import Field, Relationship, SQLModel
from models.links import RolPermisoLink



class Permiso(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    nombre: str = Field(unique=True)
    roles: list['Rol'] = Relationship(back_populates='permisos', link_model=RolPermisoLink)


class PermisosAsignacion(SQLModel):
    permiso_ids: list[int]


class PermisoResponse(SQLModel):
    id: int
    nombre: str