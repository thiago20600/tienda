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


    def listar_productos(self, session: Session, q: str | None = None, solo_activos: bool = True, incluir_eliminados: bool = False, params: Params | None = None, categoria_id: int | None = None):
        query = select(Producto)

        if not incluir_eliminados:
            query = query.where(Producto.eliminado_at == None)
        if solo_activos:
            query = query.where(Producto.producto_activo == True)
        if q is not None:
            query = query.where(Producto.nombre.ilike(f'%{q}%'))
        if categoria_id is not None:
            query = query.join(Producto.categoria).where(Categoria.id == categoria_id)

        return paginate(session, query, params)


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

        if 'precio_descuento' in update_data:
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


    def _validar_descuento(self, precio: float, precio_descuento:float):
        if precio < precio_descuento:
            raise DescuentoNoValido()