from sqlmodel import Field, Relationship, SQLModel
from typing import TYPE_CHECKING, Optional
from pydantic import EmailStr
from models.rol import Rol

if TYPE_CHECKING:  # evita import circular en runtime; SQLAlchemy resuelve el forward-ref
    from models.empleado import Empleado


class User(SQLModel, table=True):

    __tablename__ = 'user'

    id: int | None = Field(default=None, primary_key=True)
    username: str = Field(index=True)
    password: str
    email: str = Field(index=True, unique=True)
    active: bool = False
    rol_id: int | None = Field(default=None, foreign_key="rol.id")
    rol_obj: Optional[Rol] = Relationship(back_populates="usuarios")
    empleado: Optional["Empleado"] = Relationship(
        back_populates="user", sa_relationship_kwargs={"uselist": False}
    )

    @property
    def rol(self) -> str | None:
        """Nombre del rol derivado de la relacion (ya no se duplica en la tabla)."""
        return self.rol_obj.nombre if self.rol_obj else None


class UserCreate(SQLModel):
    username: str
    password: str
    email: EmailStr


class UserPublic(SQLModel):
    id: int
    username: str
    email: str
    active: bool
    rol: str | None = None


class UserUpdate(SQLModel):
    username: Optional[str] = None
    password: Optional[str] = None
    rol_id: Optional[int] = None