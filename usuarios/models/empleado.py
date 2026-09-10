from typing import Annotated, Optional
from pydantic import BeforeValidator, EmailStr
from sqlmodel import Field, SQLModel
from models.users import User, UserPublic


def _coerce_telefono(value):
    # Compatibilidad: si el front viejo manda Number, convertir a str
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

# Tabla standalone asociada a user via FK. NO hereda de User (evita el bug de
# SQLModel 0.0.37 con herencia de tablas: las relaciones del padre quedan
# instrumentadas como Mapped[] y pydantic no puede generar el schema del hijo).
class Empleado(SQLModel, table=True):
    __tablename__ = "empleado"

    id: int | None = Field(default=None, foreign_key="user.id", primary_key=True)
    telefono: TelefonoStr
    domicilio: str


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