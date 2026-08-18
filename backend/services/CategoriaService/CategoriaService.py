from models.categorias import Categoria
from sqlmodel import Session, select

class CategoriaService:

    def Consultar_por_id(self, session: Session, ids: list[int]) -> list[Categoria]:
        if not ids:
            return []
        return session.exec(select(Categoria).where(Categoria.id.in_(ids))).all()
