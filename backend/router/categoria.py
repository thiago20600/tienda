from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, File, UploadFile
from exceptions.base import BusinessError
from exceptions.categoria import CategoriaNoEncontradaError
from services.CategoriaService import CategoriaService
from services.ImagenService import ImagenService
from sqlmodel import select
from database.engine import SessionDep
from models.categorias import Categoria, CategoriaCreate, CategoriaPublic, CategoriaUpdate
from utils.permisos import permisos
router = APIRouter()

categoria_service = CategoriaService()
imagen_service = ImagenService()

@router.get('/categorias/', response_model=list[CategoriaPublic])
async def get_all_categorias(session: SessionDep):
    categorias = categoria_service.consultar_categorias(session=session)
    return categorias


@router.get('/categorias/destacadas', response_model=list[CategoriaPublic])
async def get_categorias_destacadas(session: SessionDep):
    return categoria_service.consultar_destacadas(session=session)


@router.get('/categorias/{categoria_id}', response_model=CategoriaPublic)
async def get_unique_categoria(session: SessionDep, categoria_id:int):
    try:
        categoria = categoria_service.consultar_unica_categoria(session=session, id=categoria_id)
        return categoria
    except CategoriaNoEncontradaError as e:
        raise HTTPException(status_code=404, detail=e.message)


@router.delete('/categorias/{categoria_id}', dependencies=[Depends(permisos.require_permission("categorias:delete:admin"))])
async def delete_categoria(session: SessionDep, categoria_id:int):
    try:
        return categoria_service.eliminar_categoria(session=session, id=categoria_id)
    except CategoriaNoEncontradaError as e:
        raise HTTPException(status_code=404, detail=e.message) 


@router.post('/categorias/', response_model=CategoriaPublic, dependencies=[Depends(permisos.require_permission("categorias:create:admin"))])
async def post_categoria(session: SessionDep, categoria: CategoriaCreate):
    try:
        categoria_creada = categoria_service.crear_categoria(session=session, categoria=categoria)
        return categoria_creada
    except BusinessError as e:
        raise HTTPException(status_code=400, detail=e.message)


@router.post('/categorias/{categoria_id}/imagen', response_model=CategoriaPublic, dependencies=[Depends(permisos.require_permission("categorias:update:admin"))])
async def agregar_imagen_categoria(session: SessionDep, categoria_id: int, imagen: UploadFile = File(...)):
    try:
        url = imagen_service._subir_una_imagen(imagen)
        return categoria_service.establecer_imagen_categoria(session=session, id=categoria_id, imagen_url=url)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.patch('/categorias/{categoria_id}', response_model=CategoriaPublic, dependencies=[Depends(permisos.require_permission("categorias:update:admin"))])
async def patch_categoria(session: SessionDep, categoria: CategoriaUpdate, categoria_id:int):
    try:
        categoria_actualizada = categoria_service.modificar_categoria(session=session, categoria=categoria, id=categoria_id)
        return categoria_actualizada
    except CategoriaNoEncontradaError as e:
        raise HTTPException(status_code=400, detail=e.message)
