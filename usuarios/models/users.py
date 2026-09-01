from sqlmodel import Field, Relationship, SQLModel
from typing import Optional
from pydantic import EmailStr

class RolPermisoLink(SQLModel, table=True):
    rol_id: int | None = Field(default=None, foreign_key="rol.id", primary_key=True)
    permiso_id: int | None = Field(default=None, foreign_key="permiso.id", primary_key=True)


class Rol(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    nombre: str = Field(index=True, unique=True)
    activo: bool = True
    usuarios: list["User"] = Relationship(back_populates="rol_obj")
    permisos: list['Permiso'] = Relationship(back_populates='roles', link_model=RolPermisoLink)


class Permiso(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    nombre: str = Field(unique=True)
    roles: list['Rol'] = Relationship(back_populates='permisos', link_model=RolPermisoLink)
    

class User(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    username: str = Field(index=True)
    password: str
    email: str = Field(index=True, unique=True)
    active: bool = False
    rol: str = Field(default="cliente")
    rol_id: int | None = Field(default=None, foreign_key="rol.id")
    rol_obj: Optional[Rol] = Relationship(back_populates="usuarios")


class UserCreate(SQLModel):
    username: str
    password: str
    email: EmailStr


class UserPublic(SQLModel):
    id: int
    username: str
    email: str
    active: bool
    rol: str


class UserUpdate(SQLModel):
    username: Optional[str] = None
    password: Optional[str] = None
    rol_id: Optional[int] = None