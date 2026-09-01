from sqlmodel import Session, select
from models.users import Rol, Permiso, RolPermisoLink
from exceptions.rol import (
    RolNoEncontradoError,
    RolNombreDuplicadoError,
    PermisoNoEncontradoError,
    RolProtegidoError,
)


ROLES_PROTEGIDOS = {"admin", "cliente"}


class RolService:

    def listar_roles(self, session: Session) -> list[Rol]:
        return session.exec(select(Rol)).all()

    def listar_permisos(self, session: Session) -> list[Permiso]:
        return session.exec(select(Permiso).order_by(Permiso.nombre)).all()

    def consultar_rol(self, session: Session, rol_id: int) -> Rol:
        rol = session.get(Rol, rol_id)
        if not rol:
            raise RolNoEncontradoError(rol_id=rol_id)
        return rol

    def crear_rol(self, session: Session, nombre: str, activo: bool = True) -> Rol:
        existe = session.exec(select(Rol).where(Rol.nombre == nombre)).first()
        if existe:
            raise RolNombreDuplicadoError(nombre=nombre)

        rol = Rol(nombre=nombre, activo=activo)
        session.add(rol)
        session.commit()
        session.refresh(rol)
        return rol

    def actualizar_rol(self, session: Session, rol_id: int, nombre: str | None, activo: bool | None) -> Rol:
        rol = self.consultar_rol(session=session, rol_id=rol_id)

        if nombre:
            existe = session.exec(select(Rol).where(Rol.nombre == nombre)).first()
            if existe and existe.id != rol_id:
                raise RolNombreDuplicadoError(nombre=nombre)
            rol.nombre = nombre

        if activo is not None:
            rol.activo = activo

        session.add(rol)
        session.commit()
        session.refresh(rol)
        return rol

    def asignar_permisos(self, session: Session, rol_id: int, permiso_ids: list[int]) -> Rol:
        rol = self.consultar_rol(session=session, rol_id=rol_id)

        for permiso_id in permiso_ids:
            if not session.get(Permiso, permiso_id):
                raise PermisoNoEncontradoError(permiso_id=permiso_id)

        links_actuales = session.exec(
            select(RolPermisoLink).where(RolPermisoLink.rol_id == rol_id)
        ).all()
        for link in links_actuales:
            session.delete(link)

        for permiso_id in permiso_ids:
            session.add(RolPermisoLink(rol_id=rol_id, permiso_id=permiso_id))

        session.commit()
        session.refresh(rol)
        return rol

    def eliminar_rol(self, session: Session, rol_id: int) -> dict:
        rol = self.consultar_rol(session=session, rol_id=rol_id)

        if rol.nombre in ROLES_PROTEGIDOS:
            raise RolProtegidoError(nombre=rol.nombre)

        links = session.exec(
            select(RolPermisoLink).where(RolPermisoLink.rol_id == rol_id)
        ).all()
        for link in links:
            session.delete(link)

        session.delete(rol)
        session.commit()
        return {"message": f"Rol {rol.nombre} eliminado correctamente"}
