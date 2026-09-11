from datetime import datetime, timezone
from exceptions.categoria import CategoriaNoEncontradaError
from models.categorias import Categoria, CategoriaCreate, CategoriaUpdate
from models.categorias_con_productos import CategoriaConProductos
from models.links import ProductosCategoriaLink
from models.productos import Producto
from sqlalchemy.orm import selectinload
from sqlmodel import Session, select


class CategoriaService:


    def consultar_categorias(self, session: Session) -> list[Categoria]:
        return session.exec(select(Categoria)).all()


    def consultar_destacadas(self, session: Session) -> list[Categoria]:
        return session.exec(
            select(Categoria).where(Categoria.destacado == True, Categoria.estado == True)
        ).all()


    def consultar_destacadas_con_productos(self, session: Session, limite: int = 12) -> list[CategoriaConProductos]:
        categorias = self.consultar_destacadas(session=session)
        if not categorias:
            return []

        categoria_ids = [c.id for c in categorias]

        # Una sola consulta con todos los productos activos de las categorias destacadas,
        # cargando la relacion categoria para evitar consultas N+1 al serializar.
        resultados = session.exec(
            select(Producto, ProductosCategoriaLink.categoria_id)
            .join(ProductosCategoriaLink, Producto.id == ProductosCategoriaLink.producto_id)
            .where(
                ProductosCategoriaLink.categoria_id.in_(categoria_ids),
                Producto.producto_activo == True,
                Producto.eliminado_at == None,
            )
            .options(selectinload(Producto.categoria))
            .order_by(ProductosCategoriaLink.categoria_id, Producto.id)
        ).all()

        productos_por_categoria: dict[int, list[Producto]] = {}
        for producto, categoria_id in resultados:
            productos_por_categoria.setdefault(categoria_id, []).append(producto)

        return [
            CategoriaConProductos(
                id=categoria.id,
                nombre=categoria.nombre,
                imagen_url=categoria.imagen_url,
                estado=categoria.estado,
                destacado=categoria.destacado,
                created_at=categoria.created_at,
                productos=productos_por_categoria.get(categoria.id, [])[:limite],
            )
            for categoria in categorias
        ]


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

    def establecer_imagen_categoria(self, session: Session, id: int, imagen_url: str) -> Categoria:
        categoria_db = self.consultar_unica_categoria(session=session, id=id)
        categoria_db.imagen_url = [imagen_url]
        categoria_db.updated_at = datetime.now(timezone.utc)
        session.add(categoria_db)
        session.commit()
        session.refresh(categoria_db)
        return categoria_db