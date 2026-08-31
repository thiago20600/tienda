# -*- coding: utf-8 -*-
from sqlmodel import SQLModel, Session, create_engine, select
from sqlalchemy import text
from typing import Annotated
from fastapi import Depends
from config import settings
from models.users import Rol


engine = create_engine(settings.DB_URL)


def _seed_roles(session: Session):
    roles = ["admin", "cliente"]
    for nombre in roles:
        existe = session.exec(select(Rol).where(Rol.nombre == nombre)).first()
        if not existe:
            session.add(Rol(nombre=nombre, activo=True))


def create_db_and_tables():
    SQLModel.metadata.create_all(engine)

    with Session(engine) as session:
        _seed_roles(session)
        session.commit()


def get_session():
    with Session(engine) as session:
        yield session


SessionDep = Annotated[Session, Depends(get_session)]