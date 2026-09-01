from sqlmodel import Field, Relationship, SQLModel
from typing import Optional
from models.permisos import Permiso, PermisoResponse
from models.links import RolPermisoLink


class RolCreate(SQLModel):
    nombre: str
    activo: bool = True


class RolUpdate(SQLModel):
    nombre: Optional[str] = None
    activo: Optional[bool] = None




class RolResponse(SQLModel):
    id: int
    nombre: str
    activo: bool
    permisos: list[PermisoResponse] = []

    @classmethod
    def from_rol(cls, rol: "Rol") -> "RolResponse":
        permisos = [PermisoResponse(id=p.id, nombre=p.nombre) for p in rol.permisos]
        return cls(id=rol.id, nombre=rol.nombre, activo=rol.activo, permisos=permisos)


class Rol(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    nombre: str = Field(index=True, unique=True)
    activo: bool = True
    usuarios: list["User"] = Relationship(back_populates="rol_obj")
    permisos: list['Permiso'] = Relationship(back_populates='roles', link_model=RolPermisoLink)