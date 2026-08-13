from typing import List
from sqlmodel import SQLModel
from fastapi_mail import NameEmail


class EmailSchema(SQLModel):
    email: List[str]