from sqlmodel import Field, Relationship, SQLModel
from typing import Optional
from pydantic import EmailStr


class RolPermisoLink(SQLModel, table=True):
    rol_id: int | None = Field(default=None, foreign_key="rol.id", primary_key=True)
    permiso_id: int | None = Field(default=None, foreign_key="permiso.id", primary_key=True)
