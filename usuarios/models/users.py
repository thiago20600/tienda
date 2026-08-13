from sqlmodel import Field, SQLModel
from typing import Optional
from pydantic import EmailStr

class User(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    username: str = Field(index=True)
    password: str
    email: str = Field(index=True, unique=True)
    active: bool = False
    rol: str = Field(default="cliente")


class UserCreate(SQLModel):
    username: str
    password: str
    email: EmailStr


class UserPublic(SQLModel):
    id: int
    username: str
    email: str
    active: bool


class UserUpdate(SQLModel):
    username: Optional[str] = None
    password: Optional[str] = None
    