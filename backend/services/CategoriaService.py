from datetime import datetime, timezone
from exceptions.categoria import CategoriaNoEncontradaError
from models.categorias import Categoria, CategoriaCreate, CategoriaUpdate
from sqlmodel import Session, select


class CategoriaService:


    def consultar_categorias(self, session: Session) -> list[Categoria]:
        return session.exec(select(Categoria)).all()


    def consultar_destacadas(self, session: Session) -> list[Categoria]:
        return session.exec(
            select(Categoria).where(Categoria.destacado == True, Categoria.estado == True)
        ).all()


    def consultar_por_id(self, session: Session, ids: list[int]) -> list[Categoria]:
        if not ids:
            return []
        return session.exec(select(Categoria).where(Categoria.id.in_(ids))).all()


    def consultar_unica_categoria(self, session: Session, id: int) -> Categoria:
        categoria = session.get(Categoria, id)
        if not categoria:
            raise CategoriaNoEncontradaError(id=id)
        return categoria


    def eliminar_categoria(self, session: Session, id: int) -> dict:
        categoria = self.consultar_unica_categoria(session=session, id=id)
        session.delete(categoria)
        session.commit()
        return {'message': 'categoria eliminada'}


    def crear_categoria(self, session: Session, categoria: CategoriaCreate) -> Categoria:
        categoria_creada = Categoria.model_validate(categoria)
        session.add(categoria_creada)
        session.commit()
        session.refresh(categoria_creada)
        return categoria_creada


    def modificar_categoria(self, session: Session, id: int, categoria: CategoriaUpdate) -> Categoria:
        categoria_db = self.consultar_unica_categoria(session=session, id=id)

        for key, value in categoria.model_dump(exclude_unset=True).items():
            setattr(categoria_db, key, value)

        categoria_db.updated_at = datetime.now(timezone.utc)
        session.add(categoria_db)
        session.commit()
        session.refresh(categoria_db)
        return categoria_db