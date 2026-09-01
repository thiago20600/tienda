"""
Script de bootstrap manual: asigna TODOS los permisos existentes al rol 'admin'.

Correrlo UNA SOLA VEZ la primera vez que se despliega el sistema de permisos
(o cada vez que se resetea la base desde cero), ya que sin esto ningun admin
puede usar la API para autoasignarse permisos (necesita roles:update:admin
para llamar al endpoint que asigna roles:update:admin).

Uso (dentro del contenedor api_usuarios):
    docker compose exec -T -e PYTHONPATH=/code -w /code api_usuarios python scripts/bootstrap_admin.py
"""
from sqlmodel import Session, select
from database.engine import engine
from models.rol import Rol
from models.permisos import Permiso
from models.links import RolPermisoLink
from models.users import User  # noqa: F401 - registra la clase para resolver el forward-ref "User" en Rol

with Session(engine) as session:
    rol_admin = session.exec(select(Rol).where(Rol.nombre == "admin")).first()
    if not rol_admin:
        raise SystemExit("No existe el rol 'admin'. Arranca el servicio primero para que se seedee.")

    todos_los_permisos = session.exec(select(Permiso)).all()
    ya_asignados = set(
        session.exec(
            select(RolPermisoLink.permiso_id).where(RolPermisoLink.rol_id == rol_admin.id)
        ).all()
    )

    nuevos = [
        RolPermisoLink(rol_id=rol_admin.id, permiso_id=p.id)
        for p in todos_los_permisos
        if p.id not in ya_asignados
    ]

    if nuevos:
        session.add_all(nuevos)
        session.commit()

    print(f"Rol 'admin' actualizado: {len(nuevos)} permisos nuevos asignados (total {len(todos_los_permisos)}).")
