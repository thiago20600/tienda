from fastapi import APIRouter, Depends, HTTPException
from models.pedido import PedidoPublic, PedidoUpdate
from database.engine import SessionDep
from exceptions.pedido import PedidoNoEncontrado
from services.PedidoService import PedidoService
from utils.auth import require_admin


router = APIRouter()
pedido_service = PedidoService()


@router.get('/pedidos/', response_model=list[PedidoPublic], dependencies=[Depends(require_admin)])
async def get_pedidos(session: SessionDep, user_email: str | None = None):
    return pedido_service.consultar_pedidos(session=session, user_email=user_email)


@router.get('/pedidos/{pedido_id}', response_model=PedidoPublic, dependencies=[Depends(require_admin)])
async def get_pedido_por_id(session: SessionDep, pedido_id:int):
    try:
        return pedido_service.consultar_pedido_id(session=session, id=pedido_id)
    except PedidoNoEncontrado as error:
        raise HTTPException(status_code=404, detail=error.message)


@router.patch('/pedidos/{pedido_id}', response_model=PedidoPublic, dependencies=[Depends(require_admin)])
async def patch_pedido(session: SessionDep, pedido_id:int, pedido_update:PedidoUpdate):
    try:
        return pedido_service.modificar_pedido(
            session=session,
            id=pedido_id,
            pedido_update=pedido_update,
        )
    except PedidoNoEncontrado as error:
        raise HTTPException(status_code=404, detail=error.message)