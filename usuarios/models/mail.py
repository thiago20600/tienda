from typing import List
from sqlmodel import SQLModel
from fastapi_mail import NameEmail


class EmailSchema(SQLModel):
    email: List[str]


class RecuperarPasswordRequest(SQLModel):
    email: str


class RestablecerPasswordRequest(SQLModel):
    token: str
    nueva_password: str