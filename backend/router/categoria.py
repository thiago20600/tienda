from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import select
from database.engine import SessionDep
from models.categorias import Categoria, CategoriaCreate, CategoriaPublic, CategoriaUpdate
from utils.auth import require_admin
router = APIRouter()


@router.get('/categorias/', response_model=list[CategoriaPublic])
async def get_all_categorias(session: SessionDep):
    categorias = session.exec(select(Categoria)).all()
    return categorias


@router.get('/categorias/{categoria_id}', response_model=CategoriaPublic)
async def get_unique_categoria(session: SessionDep, categoria_id:int):
    categoria_db = session.get(Categoria, categoria_id)

    if not categoria_db:
        raise HTTPException(status_code=404, detail='Categoria inexistente')
    
    return categoria_db


@router.delete('/categorias/{categoria_id}', dependencies=[Depends(require_admin)])
async def delete_categoria(session: SessionDep, categoria_id:int):
    categoria_db = session.get(Categoria, categoria_id)
    
    if not categoria_db:
        raise HTTPException(status_code=404, detail='Categoria inexistente')
    
    session.delete(categoria_db)
    return {'message': 'categoria eliminada'}


@router.post('/categorias/', response_model=CategoriaPublic, dependencies=[Depends(require_admin)])
async def post_categoria(session: SessionDep, categoria: CategoriaCreate):
    categoria_validate = Categoria.model_validate(categoria)

    session.add(categoria_validate)
    session.flush()
    
    return categoria_validate


@router.patch('/categorias/{categoria_id}', response_model=CategoriaPublic, dependencies=[Depends(require_admin)])
async def patch_categoria(session: SessionDep, categoria: CategoriaUpdate, categoria_id:int):
    categoria_db = session.get(Categoria, categoria_id)

    if not categoria_db:
        raise HTTPException(status_code=404, detail='Categoria inexistente')
    
    categoria_data = categoria.model_dump(exclude_unset=True)
    for key, value in categoria_data.items():
        setattr(categoria_db, key, value)
    
    categoria_db.updated_at = datetime.now(timezone.utc)

    session.add(categoria_db)
    #session.commit()
    #session.refresh(categoria_db)


    return categoria_db