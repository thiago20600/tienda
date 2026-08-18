from fastapi import Depends, HTTPException, UploadFile
from sqlmodel import Session, select
from datetime import datetime, timezone
from enum import Enum
from models.productos import ProductCreate, ProductUpdate, Producto
from models.categorias import Categoria
from exceptions.producto import ProductoNoEncontradoError, StockInsuficienteError
from services.CategoriaService.CategoriaService import CategoriaService
from services.ImagenService.ImagenService import ImagenService
from utils.auth import require_admin

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


    def listar_productos(self, session: Session, q: str | None = None, solo_activos: bool = True, incluir_eliminados: bool = False) -> list[Producto]:
        query = select(Producto)

        if not incluir_eliminados:
            query = query.where(Producto.eliminado_at == None)

        if solo_activos:
            query = query.where(Producto.producto_activo == True)

        if q:
            query = query.where(Producto.nombre.ilike(f'%{q}%'))

        return session.exec(query).all()


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
        categorias = self.categoria_service.Consultar_por_id(session, producto.categoria)

        producto_db = Producto.model_validate(
            producto,
            update={'user_email': current_user['email'],'categoria': categorias})
        session.add(producto_db)
        session.commit()
        session.refresh(producto_db)
        return producto_db


    def actualizar_producto(self, session: Session, producto_id: int, producto_update: ProductUpdate) -> Producto:
        producto_db = session.get(Producto, producto_id)
        if not producto_db:
            raise ProductoNoEncontradoError(producto_id)

        update_data = producto_update.model_dump(exclude_unset=True)

        # Actualizar categorías si vienen
        if 'categoria' in update_data:
            categorias = self.categoria_service.Consultar_por_id(session, update_data['categoria'])
            producto_db.categoria = categorias
            del update_data['categoria']

        # Actualizar el resto de campos
        for key, value in update_data.items():
            setattr(producto_db, key, value)

        producto_db.updated_at = datetime.now(timezone.utc)
        session.add(producto_db)
        session.commit()
        session.refresh(producto_db)
        return producto_db

    def eliminar_producto(self, session: Session, producto_id: int) -> dict:
        producto_db = session.get(Producto, producto_id)
        if not producto_db:
            raise ProductoNoEncontradoError(producto_id)

        try:
            session.delete(producto_db)
            session.commit()
            return {"message": "Producto eliminado físicamente"}
        except Exception:  # En caso de violación de integridad (ej: tiene pedidos)
            session.rollback()
            producto_db.eliminado_at = datetime.now(timezone.utc)
            producto_db.producto_activo = False
            session.commit()
            return {"message": "Producto desactivado (soft delete) por tener relaciones activas"}


    def agregar_imagenes(self, session: Session, producto_id: int, archivos: list[UploadFile]) -> Producto:
        producto_db = session.get(Producto, producto_id)
        if not producto_db:
            raise ProductoNoEncontradoError(producto_id)

        imagenes_actuales = producto_db.imagen_url or []
        self.imagen_service.validar_cantidad(archivos, imagenes_actuales)

        nuevas_urls = self.imagen_service.subir_imagenes(archivos)
        producto_db.imagen_url = imagenes_actuales + nuevas_urls

        session.add(producto_db)
        session.commit()
        session.refresh(producto_db)
        return producto_db