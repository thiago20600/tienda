# -*- coding: utf-8 -*-
from sqlmodel import SQLModel, Session, create_engine, select
from sqlalchemy import text
from typing import Annotated
from fastapi import Depends
import os
from config import settings
from models.rol import Rol
from models.permisos import Permiso
from auth.auth import PERMISOS_REGISTRADOS


engine = create_engine(settings.DB_URL, echo=False)


def _seed_roles(session: Session):
    """Seed default roles (admin, cliente). Los permisos se registran
    dinamicamente por servicio via /permisos y se asignan a roles manualmente."""
    roles_data = {
        "admin": True,
        "cliente": True
    }

    for nombre, activo in roles_data.items():
        existe = session.exec(select(Rol).where(Rol.nombre == nombre)).first()
        if not existe:
            session.add(Rol(nombre=nombre, activo=activo))

    session.commit()


def _seed_permisos_propios(session: Session):
    """Crea los permisos que este mismo servicio declara via require_permission()."""
    if not PERMISOS_REGISTRADOS:
        return

    existentes = set(
        session.exec(select(Permiso.nombre).where(Permiso.nombre.in_(PERMISOS_REGISTRADOS))).all()
    )
    nuevos = [Permiso(nombre=nombre) for nombre in PERMISOS_REGISTRADOS if nombre not in existentes]

    if nuevos:
        session.add_all(nuevos)
        session.commit()


def create_db_and_tables():
    """Initialize database - creates tables and seeds default data"""
    # Create all tables from models
    SQLModel.metadata.create_all(engine)
    
    # Seed default data
    with Session(engine) as session:
        _seed_roles(session)
        _seed_permisos_propios(session)


def get_session():
    with Session(engine) as session:
        yield session


SessionDep = Annotated[Session, Depends(get_session)]