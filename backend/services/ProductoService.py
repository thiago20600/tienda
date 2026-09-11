import csv
import io
from datetime import datetime, timezone
from enum import Enum

from fastapi import UploadFile
from fastapi_pagination import Params
from fastapi_pagination.ext.sqlmodel import paginate
from sqlalchemy import String, func, or_
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import selectinload
from sqlmodel import Session, select

from exceptions.producto import DescuentoNoValido, ProductoNoEncontradoError, StockInsuficienteError
from models.categorias import Categoria
from models.links import ProductosCategoriaLink
from models.productos import ProductCreate, ProductUpdate, Producto
from services.CategoriaService import CategoriaService
from services.ImagenService import ImagenService

class OperacionStock(Enum):
    AUMENTAR = 'AUMENTAR'
    RESTAR = 'RESTAR'


def _parsear_float(valor) -> float | None:
    if valor is None or str(valor).strip() == '':
        return None
    return float(str(valor).strip())


def _parsear_int(valor) -> int | None:
    if valor is None or str(valor).strip() == '':
        return None
    return int(str(valor).strip())


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
        params: Params | None = None,
        ofertas: bool | None = None,
        destacados: bool | None = None
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

        if ofertas is True:
            query = query.where(Producto.precio_descuento != None)

        if destacados is True:
            query = query.where(Producto.destacado == True)

        # Aplicar ordenamiento
        if ordenar_por is not None:
            query = self._aplicar_ordenamiento(query, ordenar_por, orden)

        return paginate(session, query, params)


    def listar_relacionados(self, session: Session, producto_id: int, limite: int = 4) -> list[Producto]:
        producto = self.consultar_producto(session=session, producto_id=producto_id)
        categoria_ids = [categoria.id for categoria in (producto.categoria or [])]

        if not categoria_ids:
            return []

        subquery = (
            select(ProductosCategoriaLink.producto_id)
            .where(
                ProductosCategoriaLink.producto_id == Producto.id,
                ProductosCategoriaLink.categoria_id.in_(categoria_ids),
            )
        )

        query = (
            select(Producto)
            .where(
                Producto.id != producto_id,
                Producto.producto_activo == True,
                Producto.eliminado_at == None,
                subquery.exists(),
            )
            .options(selectinload(Producto.categoria))
            .order_by(Producto.created_at.desc())
            .limit(limite)
        )

        return session.exec(query).all()


    def importar_productos_csv(self, session: Session, archivo, current_user: dict) -> dict:
        lector = csv.DictReader(io.TextIOWrapper(archivo, encoding='utf-8-sig'))

        creados: list[str] = []
        errores: list[dict] = []

        for numero_fila, fila in enumerate(lector, start=1):
            try:
                nombre = (fila.get('nombre') or '').strip()
                if not nombre:
                    raise ValueError("El campo 'nombre' es obligatorio")

                precio = _parsear_float(fila.get('precio'))
                if precio is None:
                    raise ValueError("El campo 'precio' es obligatorio")

                precio_descuento = _parsear_float(fila.get('precio_descuento'))
                if precio_descuento is not None:
                    self._validar_descuento(precio, precio_descuento)

                stock = _parsear_int(fila.get('stock'))
                if stock is None:
                    raise ValueError("El campo 'stock' es obligatorio")
                if stock < 0:
                    raise ValueError("El stock no puede ser negativo")

                producto_db = Producto(
                    nombre=nombre,
                    precio=precio,
                    stock=stock,
                    sku=_parsear_int(fila.get('sku')),
                    precio_descuento=precio_descuento,
                    descripcion=(fila.get('descripcion') or '').strip() or None,
                    destacado=(fila.get('destacado') or '').strip().lower() == 'true',
                    producto_activo=(fila.get('producto_activo') or 'true').strip().lower() != 'false',
                    user_email=current_user['email'],
                    categoria=self._resolver_categorias_csv(session, fila.get('categorias') or fila.get('categoria')),
                )
                session.add(producto_db)
                creados.append(nombre)
            except (ValueError, DescuentoNoValido) as error:
                errores.append({'fila': numero_fila, 'error': str(error)})

        if creados:
            session.commit()

        return {'creados': creados, 'errores': errores}


    def _aplicar_filtro_estado(self, query, estado: bool):
        return query.where(Producto.producto_activo == estado)


    def _aplicar_filtro_nombre(self, query, q: str):
        termino = f'%{q.strip()}%'
        return query.where(
            or_(
                Producto.nombre.ilike(termino),
                func.cast(Producto.sku, String).ilike(termino),
            )
        )


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
        return (
            query
            .join(ProductosCategoriaLink, Producto.id == ProductosCategoriaLink.producto_id)
            .where(ProductosCategoriaLink.categoria_id == categoria_id)
        )


    def _aplicar_ordenamiento(self, query, ordenar_por: str, orden: str):
        columnas = {
            'nombre': Producto.nombre,
            'precio': Producto.precio,
            'stock': Producto.stock,
            'created_at': Producto.created_at,
        }
        columna = columnas.get(ordenar_por)
        if columna is None:
            return query
        return query.order_by(columna.desc() if orden == 'desc' else columna.asc())


    def _validar_descuento(self, precio: float, precio_descuento: float) -> None:
        if precio_descuento >= precio:
            raise DescuentoNoValido()


    def _resolver_categorias_csv(self, session: Session, valor: str | None) -> list[Categoria]:
        nombres = [n.strip() for n in (valor or '').split(',') if n.strip()]
        if not nombres:
            return []
        categorias = self.categoria_service.consultar_por_nombres(session, nombres)
        encontrados = {c.nombre for c in categorias}
        faltantes = [n for n in nombres if n not in encontrados]
        if faltantes:
            raise ValueError(f"Categorias inexistentes: {', '.join(faltantes)}")
        return categorias


    def listar_destacados(self, session: Session, limite: int = 10) -> list[Producto]:
        query = (
            select(Producto)
            .options(selectinload(Producto.categoria))
            .where(Producto.producto_activo == True, Producto.eliminado_at == None, Producto.destacado == True)
            .order_by(Producto.updated_at.desc().nullslast(), Producto.id.desc())
            .limit(limite)
        )
        return list(session.exec(query).all())


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