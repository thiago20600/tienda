from sqlmodel import Field, SQLModel
from models.users import User, UserPublic

class Empleado(User, table=True):
    __tablename__ = "empleado"


    id: int | None = Field(default=None, foreign_key="user.id", primary_key=True)
    telefono: int  
    domicilio: str


    __mapper_args__ = {
        "polymorphic_identity": "empleado" 
    }


class EmpleadoPublic(UserPublic):
    telefono: int
    domicilio: str