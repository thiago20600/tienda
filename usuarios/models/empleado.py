from typing import Annotated, Optional
from pydantic import BeforeValidator, EmailStr
from sqlmodel import Field, Relationship, SQLModel
from models.users import User, UserPublic


def _coerce_telefono(value):
    if isinstance(value, bool):
        raise ValueError("telefono inválido")
    if isinstance(value, int):
        return str(value)
    if isinstance(value, float):
        return str(int(value))
    return value


TelefonoStr = Annotated[
    str,
    BeforeValidator(_coerce_telefono),
    Field(min_length=6, max_length=20, regex=r"^[0-9+\-\s()]+$"),
]


class Empleado(SQLModel, table=True):
    __tablename__ = "empleado"

    id: int | None = Field(default=None, foreign_key="user.id", primary_key=True)
    telefono: TelefonoStr
    domicilio: str
    user: Optional["User"] = Relationship(back_populates="empleado")


class EmpleadoPublic(UserPublic):
    telefono: str
    domicilio: str


class EmpleadoCreate(SQLModel):
    username: str
    email: EmailStr
    password: str
    telefono: TelefonoStr
    domicilio: str
    rol_id: int | None = None