from sqlmodel import Session, select

from exceptions.producto import ProductoNoEncontradoError
from models.favoritos import Favorito
from models.productos import Producto


class FavoritoDuplicadoError(Exception):
    def __init__(self, producto_id: int):
        self.producto_id = producto_id
        super().__init__(f"El producto {producto_id} ya está en favoritos")


class FavoritoService:

    def listar(self, session: Session, user_email: str) -> list[Favorito]:
        return list(session.exec(
            select(Favorito)
            .where(Favorito.user_email == user_email)
            .order_by(Favorito.created_at.desc())
        ).all())

    def es_favorito(self, session: Session, user_email: str, producto_id: int) -> bool:
        favorito = session.exec(
            select(Favorito)
            .where(Favorito.user_email == user_email, Favorito.producto_id == producto_id)
        ).first()
        return favorito is not None

    def agregar(self, session: Session, user_email: str, producto_id: int) -> Favorito:
        if self.es_favorito(session, user_email, producto_id):
            raise FavoritoDuplicadoError(producto_id)

        producto = session.get(Producto, producto_id)
        if not producto or not producto.producto_activo or producto.eliminado_at is not None:
            raise ProductoNoEncontradoError(producto_id)

        favorito = Favorito(user_email=user_email, producto_id=producto_id)
        session.add(favorito)
        session.commit()
        session.refresh(favorito)
        return favorito

    def eliminar(self, session: Session, user_email: str, producto_id: int) -> bool:
        favorito = session.exec(
            select(Favorito)
            .where(Favorito.user_email == user_email, Favorito.producto_id == producto_id)
        ).first()
        if not favorito:
            return False
        session.delete(favorito)
        session.commit()
        return True
