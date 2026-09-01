# -*- coding: utf-8 -*-
from sqlmodel import SQLModel, Session, create_engine, select
from sqlalchemy import text
from typing import Annotated
from fastapi import Depends
import os
from config import settings
from models.users import Rol, Permiso, RolPermisoLink


engine = create_engine(settings.DB_URL, echo=False)


def _seed_roles_and_permissions(session: Session):
    """Seed default roles and permissions"""
    # Create roles
    roles_data = {
        "admin": True,
        "cliente": True
    }
    
    roles_dict = {}
    for nombre, activo in roles_data.items():
        existe = session.exec(select(Rol).where(Rol.nombre == nombre)).first()
        if existe:
            roles_dict[nombre] = existe
        else:
            rol = Rol(nombre=nombre, activo=activo)
            session.add(rol)
            session.flush()
            roles_dict[nombre] = rol
    
    # Define default permissions
    default_permissions = [
        # Productos
        "productos.create",
        "productos.read",
        "productos.update",
        "productos.delete",
        
        # Categorías
        "categorias.create",
        "categorias.read",
        "categorias.update",
        "categorias.delete",
        
        # Pedidos
        "pedidos.create",
        "pedidos.read",
        "pedidos.update",
        "pedidos.delete",
        
        # Usuarios
        "usuarios.create",
        "usuarios.read",
        "usuarios.update",
        "usuarios.delete",
        
        # Carrito
        "carrito.create",
        "carrito.read",
        "carrito.update",
        "carrito.delete",
    ]
    
    permisos_dict = {}
    for permiso_nombre in default_permissions:
        existe = session.exec(select(Permiso).where(Permiso.nombre == permiso_nombre)).first()
        if existe:
            permisos_dict[permiso_nombre] = existe
        else:
            permiso = Permiso(nombre=permiso_nombre)
            session.add(permiso)
            session.flush()
            permisos_dict[permiso_nombre] = permiso
    
    # Assign permissions to roles
    # Admin gets all permissions
    admin_rol = roles_dict["admin"]
    for permiso_nombre, permiso in permisos_dict.items():
        # Check if this permission already exists for admin
        existe_link = session.exec(
            select(RolPermisoLink)
            .where(RolPermisoLink.rol_id == admin_rol.id)
            .where(RolPermisoLink.permiso_id == permiso.id)
        ).first()
        if not existe_link:
            link = RolPermisoLink(rol_id=admin_rol.id, permiso_id=permiso.id)
            session.add(link)
    
    # Cliente gets only read permissions
    cliente_rol = roles_dict["cliente"]
    read_permissions = [p for p in permisos_dict.keys() if p.endswith(".read")]
    for perm_name in read_permissions:
        permiso = permisos_dict[perm_name]
        existe_link = session.exec(
            select(RolPermisoLink)
            .where(RolPermisoLink.rol_id == cliente_rol.id)
            .where(RolPermisoLink.permiso_id == permiso.id)
        ).first()
        if not existe_link:
            link = RolPermisoLink(rol_id=cliente_rol.id, permiso_id=permiso.id)
            session.add(link)
    
    session.commit()


def create_db_and_tables():
    """Initialize database - creates tables and seeds default data"""
    # Create all tables from models
    SQLModel.metadata.create_all(engine)
    
    # Seed default data
    with Session(engine) as session:
        _seed_roles_and_permissions(session)


def get_session():
    with Session(engine) as session:
        yield session


SessionDep = Annotated[Session, Depends(get_session)]