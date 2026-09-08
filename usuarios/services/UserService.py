from sqlmodel import Session, select
from fastapi_pagination import Params, Page
from fastapi_pagination.ext.sqlmodel import paginate
from models.users import User, UserPublic
from exceptions.usuario import UsuarioNoEncontradoError, CambioDeRolNoPermitido
from services.RolService import RolService



class UserService:

    def __init__(self, rol_service: RolService | None = None): 
        self.rol_service = rol_service or RolService()


    def listar_usuarios(self,session: Session,q: str | None = None,params: Params = Params()) -> Page[UserPublic]:
            query = select(User)
            if q:
                query = query.where(User.username.ilike(f"%{q}%"))
            
            return paginate(session, query, params)


    def consultar_usuario_por_id(self, session: Session, id: int) -> User | Exception:
        usuario = session.get(User, id)
        if not User:
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