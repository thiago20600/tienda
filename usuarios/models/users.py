from sqlmodel import Field, Relationship, SQLModel
from typing import Optional
from pydantic import EmailStr
from models.rol import Rol



class User(SQLModel, table=True):

    __tablename__ = 'user'

    id: int | None = Field(default=None, primary_key=True)
    username: str = Field(index=True)
    password: str
    email: str = Field(index=True, unique=True)
    active: bool = False
    rol: str = Field(default="cliente")
    tipo: str = Field(default="cliente")
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
    tipo: str = "cliente"


class UserUpdate(SQLModel):
    username: Optional[str] = None
    password: Optional[str] = None
    rol_id: Optional[int] = None