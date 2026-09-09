from sqlmodel import Session, select
from fastapi_pagination import Params, Page
from fastapi_pagination.ext.sqlmodel import paginate
from bcrypt import hashpw, gensalt
from models.users import User, UserPublic
from models.empleado import Empleado
from models.rol import Rol
from exceptions.usuario import (
    UsuarioNoEncontradoError,
    UsuarioDuplicadoError,
    CambioDeRolNoPermitido,
)
from exceptions.rol import RolNoEncontradoError
from services.RolService import RolService



class UserService:

    def __init__(self, rol_service: RolService | None = None): 
        self.rol_service = rol_service or RolService()


    def listar_usuarios(
        self,
        session: Session,
        q: str | None = None,
        rol: str | None = None,
        tipo: str | None = None,
        params: Params = Params(),
    ) -> Page[UserPublic]:
        query = select(User)

        if q:
            query = query.where(User.username.ilike(f"%{q}%"))
        if rol:
            query = query.where(User.rol == rol)
        if tipo:
            query = query.where(User.tipo == tipo)

        return paginate(session, query, params)


    def consultar_usuario_por_id(self, session: Session, id: int) -> User | Exception:
        usuario = session.get(User, id)
        if not usuario:
            raise UsuarioNoEncontradoError(usuario_id=id)
        return usuario

    def asignar_rol(self, session: Session, usuario_id: int, rol_id: int) -> User | Exception :

        usuario = self.consultar_usuario_por_id(session=session, id=usuario_id)
        rol = self.rol_service.consultar_rol(session=session, rol_id=rol_id)
        if not usuario or not rol:
            raise UsuarioNoEncontradoError(usuario_id=usuario_id)
        if usuario.rol == 'cliente' or rol.nombre == 'cliente':
            raise CambioDeRolNoPermitido()

        usuario.rol_id = rol.id
        usuario.rol = rol.nombre

        session.add(usuario)
        session.commit()
        session.refresh(usuario)

        return usuario


    def crear_empleado(
        self,
        session: Session,
        username: str,
        email: str,
        password: str,
        telefono: int,
        domicilio: str,
        rol_id: int | None = None,
    ) -> dict:
        duplicado = session.exec(
            select(User).where((User.email == email) | (User.username == username))
        ).first()

        if duplicado:
            campo = "email" if duplicado.email == email else "username"
            raise UsuarioDuplicadoError(campo=campo, valor=getattr(duplicado, campo))

        rol = None
        if rol_id is not None:
            rol = self.rol_service.consultar_rol(session=session, rol_id=rol_id)

        if not rol:
            rol = session.exec(select(Rol).where(Rol.nombre == "empleado")).first()
            if not rol:
                rol = Rol(nombre="empleado", activo=True)
                session.add(rol)
                session.flush()

        usuario = User(
            username=username,
            email=email,
            password=hashpw(password.encode("utf-8"), gensalt()).decode("utf-8"),
            active=True,
            rol=rol.nombre,
            tipo="empleado",
            rol_id=rol.id,
        )
        session.add(usuario)
        session.flush()

        empleado = Empleado(
            id=usuario.id,
            telefono=telefono,
            domicilio=domicilio,
        )
        session.add(empleado)
        session.commit()
        session.refresh(usuario)

        return {
            "id": usuario.id,
            "username": usuario.username,
            "email": usuario.email,
            "active": usuario.active,
            "rol": usuario.rol,
            "tipo": usuario.tipo,
            "telefono": empleado.telefono,
            "domicilio": empleado.domicilio,
        }