from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import select
from models.pedido import Pedido, PedidoPublic, PedidoUpdate, EstadoPedido
from database.engine import SessionDep
from utils.auth import require_admin


router = APIRouter()


@router.get('/pedidos/', response_model=list[PedidoPublic], dependencies=[Depends(require_admin)])
async def get_pedidos(session: SessionDep):
    pedidos = session.exec(select(Pedido)).all()
    return pedidos


@router.get('/pedidos/{pedido_id}', response_model=PedidoPublic, dependencies=[Depends(require_admin)])
async def get_pedido_por_id(session: SessionDep, pedido_id:int):
    pedido_db = session.get(Pedido, pedido_id)

    if not pedido_db:
        raise HTTPException(status_code=404, detail='pedido no encontrado')
    
    return pedido_db


@router.patch('/pedidos/{pedido_id}', response_model=PedidoPublic, dependencies=[Depends(require_admin)])
async def patch_pedido(session: SessionDep, pedido_id:int, pedido_update:PedidoUpdate):
    pedido_db = session.get(Pedido, pedido_id)
    
    if not pedido_db:
        raise HTTPException(status_code=404, detail='Pedido no encontrado')
    
    estado_anterior = pedido_db.estado

    if estado_anterior == EstadoPedido.entregado or estado_anterior == EstadoPedido.cancelado:
        raise HTTPException(status_code=400, detail='No se puede modificar un pedido entregado o cancelado')

    pedido_data = pedido_update.model_dump(exclude_unset=True)
    for key, value in pedido_data.items():
        setattr(pedido_db, key, value)
    
    
    pedido_db.updated_at = datetime.now(timezone.utc)

    if pedido_db.estado == EstadoPedido.cancelado:
        pedido_db.canceled_at = datetime.now(timezone.utc)
    elif pedido_db.estado == EstadoPedido.entregado:
        pedido_db.entregado_at = datetime.now(timezone.utc)
    
    session.add(pedido_db)
    session.refresh(pedido_db)


    return pedido_db