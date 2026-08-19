from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException
from exceptions.base import BusinessError
from exceptions.categoria import CategoriaNoEncontradaError
from services.CategoriaService import CategoriaService
from sqlmodel import select
from database.engine import SessionDep
from models.categorias import Categoria, CategoriaCreate, CategoriaPublic, CategoriaUpdate
from utils.auth import require_admin
router = APIRouter()

categoria_service = CategoriaService()

@router.get('/categorias/', response_model=list[CategoriaPublic])
async def get_all_categorias(session: SessionDep):
    categorias = categoria_service.consultar_categorias(session=session)
    return categorias


@router.get('/categorias/{categoria_id}', response_model=CategoriaPublic)
async def get_unique_categoria(session: SessionDep, categoria_id:int):
    try:
        categoria = categoria_service.consultar_unica_categoria(session=session, id=id)
        return categoria
    except CategoriaNoEncontradaError as e:
        raise HTTPException(status_code=404, detail=e.message)


@router.delete('/categorias/{categoria_id}', dependencies=[Depends(require_admin)])
async def delete_categoria(session: SessionDep, id:int):
    try:
        categoria_service.eliminar_categoria(session=session, id=id)
    except CategoriaNoEncontradaError as e:
        raise HTTPException(status_code=404, detail=e.message) 


@router.post('/categorias/', response_model=CategoriaPublic, dependencies=[Depends(require_admin)])
async def post_categoria(session: SessionDep, categoria: CategoriaCreate):
    try:
        categoria_creada = categoria_service.crear_categoria(session=session, categoria=categoria)
        return categoria_creada
    except BusinessError as e:
        raise HTTPException(status_code=400, detail=e.message)


@router.patch('/categorias/{categoria_id}', response_model=CategoriaPublic, dependencies=[Depends(require_admin)])
async def patch_categoria(session: SessionDep, categoria: CategoriaUpdate, id:int):
    try:
        categoria_actualizada = categoria_service.modificar_categoria(session=session, categoria=categoria, id=id)
        return categoria_actualizada
    except CategoriaNoEncontradaError as e:
        raise HTTPException(status_code=400, detail=e.message)
