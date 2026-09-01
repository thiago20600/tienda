from fastapi import APIRouter, Depends, HTTPException, File, UploadFile
from sqlmodel import Session
from typing import List
from database.engine import SessionDep
from models.productos import ProductCreate, ProductUpdate, ProductoPublic
from services.ProductoService import ProductoService
from services.CategoriaService import CategoriaService
from services.ImagenService import ImagenService
from utils.permisos import permisos
from exceptions.producto import ProductoNoEncontradoError
from fastapi_pagination import Page, Params


router = APIRouter()

# Instanciar servicios
categoria_service = CategoriaService()
imagen_service = ImagenService()
producto_service = ProductoService(categoria_service, imagen_service)


@router.get('/productos', response_model=Page[ProductoPublic])
async def get_all_products(
    session: SessionDep,
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
    params: Params = Depends()
):
    try:
        productos = producto_service.listar_productos(
            session,
            q=q,
            estado=estado,
            precio_min=precio_min,
            precio_max=precio_max,
            stock_min=stock_min,
            stock_max=stock_max,
            sku=sku,
            categoria_id=categoria_id,
            ordenar_por=ordenar_por,
            orden=orden,
            solo_activos=True,
            incluir_eliminados=False,
            params=params
        )
        return productos
    except Exception as e:
        raise HTTPException(500, str(e))


@router.get('/productos/{producto_id}', response_model=ProductoPublic)
async def get_product(session: SessionDep, producto_id: int):
    try:
        return producto_service.consultar_producto(session, producto_id)
    except ProductoNoEncontradoError:
        raise HTTPException(404, "Producto no encontrado")




@router.post('/productos', response_model=ProductoPublic, dependencies=[Depends(permisos.require_permission("productos:create:admin"))])
async def post_product(session: SessionDep, producto: ProductCreate, current_user=Depends(permisos.require_permission("productos:create:admin"))):
    try:
        return producto_service.crear_producto(session, producto, current_user)
    except Exception as e:
        raise HTTPException(400, str(e))

    
@router.patch('/productos/{producto_id}', response_model=ProductoPublic, dependencies=[Depends(permisos.require_permission("productos:update:admin"))])
async def patch_product(session: SessionDep, producto_id: int, producto_update: ProductUpdate):
    try:
        return producto_service.actualizar_producto(session, producto_id, producto_update)
    except ProductoNoEncontradoError:
        raise HTTPException(404, "Producto no encontrado")
    except Exception as e:
        raise HTTPException(400, str(e))
    

@router.delete('/productos/{producto_id}', dependencies=[Depends(permisos.require_permission("productos:delete:admin"))])
async def delete_product(session: SessionDep, producto_id: int):
    try:
        return producto_service.eliminar_producto(session, producto_id)
    except ProductoNoEncontradoError:
        raise HTTPException(404, "Producto no encontrado")
    except Exception as e:
        raise HTTPException(500, str(e))


@router.post('/productos/{producto_id}/imagenes', response_model=ProductoPublic, dependencies=[Depends(permisos.require_permission("productos:update:admin"))])
async def agregar_imagen_producto(
    session: SessionDep,
    producto_id: int,
    archivos: list[UploadFile] = File(...)
):
    try:
        return producto_service.agregar_imagenes(session, producto_id, archivos)
    except ProductoNoEncontradoError:
        raise HTTPException(404, "Producto no encontrado")
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(500, str(e))
    

@router.get('/admin/productos', response_model=Page[ProductoPublic], dependencies=[Depends(permisos.require_permission("productos:read:admin"))])
async def get_all_products_admin(
    session: SessionDep,
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
    params: Params = Depends()
):
    try:
        productos = producto_service.listar_productos(
            session,
            q=q,
            estado=estado,
            precio_min=precio_min,
            precio_max=precio_max,
            stock_min=stock_min,
            stock_max=stock_max,
            sku=sku,
            categoria_id=categoria_id,
            ordenar_por=ordenar_por,
            orden=orden,
            solo_activos=False,
            incluir_eliminados=False,
            params=params
        )
        return productos
    except Exception as e:
        raise HTTPException(500, str(e))