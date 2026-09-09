from typing import Optional
from pydantic import EmailStr
from sqlmodel import Field, SQLModel
from models.users import User, UserPublic

# Tabla standalone asociada a user via FK. NO hereda de User (evita el bug de
# SQLModel 0.0.37 con herencia de tablas: las relaciones del padre quedan
# instrumentadas como Mapped[] y pydantic no puede generar el schema del hijo).
class Empleado(SQLModel, table=True):
    __tablename__ = "empleado"

    id: int | None = Field(default=None, foreign_key="user.id", primary_key=True)
    telefono: int
    domicilio: str


class EmpleadoPublic(UserPublic):
    telefono: int
    domicilio: str


class EmpleadoCreate(SQLModel):
    username: str
    email: EmailStr
    password: str
    telefono: int
    domicilio: str
    rol_id: int | None = None