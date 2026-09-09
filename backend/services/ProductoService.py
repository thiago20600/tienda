from fastapi import UploadFile
from models.categorias import Categoria
from sqlmodel import Session, select
from sqlalchemy.exc import IntegrityError
from datetime import datetime, timezone
from enum import Enum
from models.productos import ProductCreate, ProductUpdate, Producto
from exceptions.producto import ProductoNoEncontradoError, StockInsuficienteError, DescuentoNoValido
from services.CategoriaService import CategoriaService
from services.ImagenService import ImagenService
from fastapi_pagination import Params
from fastapi_pagination.ext.sqlmodel import paginate

class OperacionStock(Enum):
    AUMENTAR = 'AUMENTAR'
    RESTAR = 'RESTAR'


class ProductoService:
    def __init__(self, categoria_service: CategoriaService | None = None, imagen_service: ImagenService | None = None):
        self.categoria_service = categoria_service or CategoriaService()
        self.imagen_service = imagen_service or ImagenService()


    def consultar_producto(self, session: Session, producto_id: int) -> Producto:
        producto = session.get(Producto, producto_id)
        if not producto:
            raise ProductoNoEncontradoError(producto_id)
        return producto


    def listar_productos(
        self,
        session: Session,
        q: str | None = None,
        estado: bool | None = None,
        precio_min: float | None = None,
        precio_max: float | None = None,
        stock_min: int | None = None,
        stock_max: int | None = None,
        sku: int | None = None,
        categoria_id: int | None = None,
        ordenar_por: str | None = None,
        orden: str = 'asc',
        solo_activos: bool = True,
        incluir_eliminados: bool = False,
        params: Params | None = None
    ):
        query = select(Producto)


        if not incluir_eliminados:
            query = query.where(Producto.eliminado_at == None)

        if solo_activos and estado is None:
            query = query.where(Producto.producto_activo == True)

        if estado is not None:
            query = self._aplicar_filtro_estado(query, estado)

        if q is not None:
            query = self._aplicar_filtro_nombre(query, q)

        if precio_min is not None or precio_max is not None:
            query = self._aplicar_filtro_precio(query, precio_min, precio_max)

        if stock_min is not None or stock_max is not None:
            query = self._aplicar_filtro_stock(query, stock_min, stock_max)

        if sku is not None:
            query = self._aplicar_filtro_sku(query, sku)

        if categoria_id is not None:
            query = self._aplicar_filtro_categoria(query, categoria_id)

        # Aplicar ordenamiento
        if ordenar_por is not None:
            query = self._aplicar_ordenamiento(query, ordenar_por, orden)

        return paginate(session, query, params)


    def listar_destacados(self, session: Session, limite: int = 10) -> list[Producto]:
        query = (
            select(Producto)
            .where(
                Producto.destacado == True,
                Producto.producto_activo == True,
                Producto.eliminado_at == None
            )
            .order_by(Producto.created_at.desc())
            .limit(limite)
        )
        return session.exec(query).all()


    def _aplicar_filtro_estado(self, query, estado: bool):
        return query.where(Producto.producto_activo == estado)


    def _aplicar_filtro_nombre(self, query, q: str):
        return query.where(Producto.nombre.ilike(f'%{q}%'))


    def _aplicar_filtro_precio(self, query, precio_min: float | None, precio_max: float | None):
        if precio_min is not None:
            query = query.where(Producto.precio >= precio_min)
        if precio_max is not None:
            query = query.where(Producto.precio <= precio_max)
        return query


    def _aplicar_filtro_stock(self, query, stock_min: int | None, stock_max: int | None):
        if stock_min is not None:
            query = query.where(Producto.stock >= stock_min)
        if stock_max is not None:
            query = query.where(Producto.stock <= stock_max)
        return query


    def _aplicar_filtro_sku(self, query, sku: int):
        return query.where(Producto.sku == sku)


    def _aplicar_filtro_categoria(self, query, categoria_id: int):
        return query.join(Producto.categoria).where(Categoria.id == categoria_id)


    def _aplicar_ordenamiento(self, query, ordenar_por: str, orden: str = 'asc'):
        campos_validos = {'nombre', 'precio', 'stock', 'sku'}
        
        if ordenar_por not in campos_validos:
            return query

        campo = getattr(Producto, ordenar_por)
        
        if orden.lower() == 'desc':
            return query.order_by(campo.desc())
        else:
            return query.order_by(campo.asc())


    def actualizar_stock(self, producto: Producto, cantidad: int, operacion: OperacionStock) -> Producto:
        match operacion:
            case OperacionStock.AUMENTAR:
                producto.stock += cantidad
            case OperacionStock.RESTAR:
                if producto.stock < cantidad:
                    raise StockInsuficienteError(producto.nombre, producto.stock, cantidad)
                producto.stock -= cantidad
            case _:
                raise ValueError("Operación de stock no válida")
        return producto


    def crear_producto(self, session: Session, producto: ProductCreate, current_user: dict) -> Producto:
        categorias = self.categoria_service.consultar_por_id(session, producto.categoria)

        producto_db = Producto.model_validate(producto, update={'user_email': current_user['email'], 'categoria': categorias})

        if producto_db.precio_descuento is not None:
            self._validar_descuento(precio=producto_db.precio, precio_descuento=producto_db.precio_descuento)

        session.add(producto_db)
        session.commit()
        session.refresh(producto_db)
        return producto_db


    def actualizar_producto(self, session: Session, producto_id: int, producto_update: ProductUpdate) -> Producto:
        producto = self.consultar_producto(session=session, producto_id=producto_id)
        update_data = producto_update.model_dump(exclude_unset=True)

        if 'categoria' in update_data:
            producto.categoria = self.categoria_service.consultar_por_id(session, update_data.pop('categoria'))

        if 'precio_descuento' in update_data and update_data['precio_descuento'] is not None:
            precio = update_data.get('precio', producto.precio)
            self._validar_descuento(precio, update_data['precio_descuento'])

        for key, value in update_data.items():
            setattr(producto, key, value)

        producto.updated_at = datetime.now(timezone.utc)
        session.add(producto)
        session.commit()
        session.refresh(producto)
        return producto


    def eliminar_producto(self, session: Session, producto_id: int) -> dict:
        producto = self.consultar_producto(session=session, producto_id=producto_id)

        try:
            session.delete(producto)
            session.commit()
            return {"message": "Producto eliminado"}
        except IntegrityError:
            session.rollback()
            return self._desactivar_producto(session, producto)


    def _desactivar_producto(self, session: Session, producto: Producto) -> dict:
        producto.eliminado_at = datetime.now(timezone.utc)
        producto.producto_activo = False
        session.add(producto)
        session.commit()
        return {"message": "Producto desactivado"}


    def agregar_imagenes(self, session: Session, producto_id: int, archivos: list[UploadFile]) -> Producto:
        producto = self.consultar_producto(session=session, producto_id=producto_id)

        imagenes_actuales = producto.imagen_url or []
        self.imagen_service.validar_cantidad(archivos, imagenes_actuales)

        producto.imagen_url = imagenes_actuales + self.imagen_service.subir_imagenes(archivos)
        session.add(producto)
        session.commit()
        session.refresh(producto)
        return producto


    def _validar_descuento(self, precio: float, precio_descuento: float):
        if precio is None or precio_descuento is None:
            return
        if precio < precio_descuento:
            raise DescuentoNoValido()