from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.exc import IntegrityError

from database.engine import SessionDep
from exceptions.producto import ProductoNoEncontradoError
from models.favoritos import FavoritoPublic
from services.FavoritoService import FavoritoDuplicadoError, FavoritoService
from utils.permisos import permisos

router = APIRouter()

favorito_service = FavoritoService()


@router.get('/favoritos', response_model=list[FavoritoPublic])
async def get_favoritos(
    session: SessionDep,
    current_user=Depends(permisos.require_permission("favoritos:read:own")),
):
    return favorito_service.listar(session, current_user['email'])


@router.post('/favoritos/{producto_id}', response_model=FavoritoPublic, status_code=201)
async def post_favorito(
    session: SessionDep,
    producto_id: int,
    current_user=Depends(permisos.require_permission("favoritos:write:own")),
):
    try:
        return favorito_service.agregar(session, current_user['email'], producto_id)
    except FavoritoDuplicadoError:
        raise HTTPException(status_code=409, detail='El producto ya está en favoritos')
    except ProductoNoEncontradoError:
        raise HTTPException(status_code=404, detail='Producto no encontrado')
    except IntegrityError:
        raise HTTPException(status_code=409, detail='El producto ya está en favoritos')


@router.delete('/favoritos/{producto_id}')
async def delete_favorito(
    session: SessionDep,
    producto_id: int,
    current_user=Depends(permisos.require_permission("favoritos:write:own")),
):
    eliminado = favorito_service.eliminar(session, current_user['email'], producto_id)
    if not eliminado:
        raise HTTPException(status_code=404, detail='El producto no está en favoritos')
    return {'message': 'Favorito eliminado'}
