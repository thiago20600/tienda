from sqlmodel import Session, select
from fastapi_pagination import Params
from fastapi_pagination.ext.sqlmodel import paginate
from models.users import User


class UserService:
    def listar_usuarios(self, session: Session, q: str | None = None, params: Params | None = None):
        query = select(User)

        if q is not None and q.strip():
            query = query.where(User.email.ilike(f'%{q.strip()}%'))

        if params is not None:
            return paginate(session, query, params)

        return session.exec(query).all()
