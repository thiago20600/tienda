from sqlmodel import SQLModel
from typing import Optional
from models.users import Rol


class RolCreate(SQLModel):
    nombre: str
    activo: bool = True


class RolUpdate(SQLModel):
    nombre: Optional[str] = None
    activo: Optional[bool] = None


class PermisosAsignacion(SQLModel):
    permiso_ids: list[int]


class PermisoResponse(SQLModel):
    id: int
    nombre: str


class RolResponse(SQLModel):
    id: int
    nombre: str
    activo: bool
    permisos: list[PermisoResponse] = []

    @classmethod
    def from_rol(cls, rol: Rol) -> "RolResponse":
        permisos = [PermisoResponse(id=p.id, nombre=p.nombre) for p in rol.permisos]
        return cls(id=rol.id, nombre=rol.nombre, activo=rol.activo, permisos=permisos)
