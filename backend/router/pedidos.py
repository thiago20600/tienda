from fastapi import APIRouter, Depends, HTTPException
from models.pedido import PedidoClientePublic, PedidoPublic, PedidoUpdate
from database.engine import SessionDep
from exceptions.pedido import PedidoNoEncontrado
from services.PedidoService import PedidoService
from utils.permisos import permisos
from fastapi_pagination import Page, Params


router = APIRouter()
pedido_service = PedidoService()


@router.get('/mis-pedidos', response_model=Page[PedidoClientePublic])
async def get_mis_pedidos(
    session: SessionDep,
    params: Params = Depends(),
    current_user=Depends(permisos.require_permission("pedidos:read:own")),
):
    return pedido_service.consultar_pedidos(
        session=session,
        user_email=current_user['email'],
        params=params,
    )


@router.get('/pedidos/', response_model=Page[PedidoPublic], dependencies=[Depends(permisos.require_permission("pedidos:read:admin"))])
async def get_pedidos(
    session: SessionDep,
    user_email: str | None = None,
    numero_pedido: str | None = None,
    estado: str | None = None,
    metodo_pago: str | None = None,
    precio_total: str | None = None,
    params: Params = Depends()
):
    return pedido_service.consultar_pedidos(
        session=session,
        user_email=user_email,
        numero_pedido=numero_pedido,
        estado=estado,
        metodo_pago=metodo_pago,
        precio_total=precio_total,
        params=params
    )


@router.get('/pedidos/{pedido_id}', response_model=PedidoPublic, dependencies=[Depends(permisos.require_permission("pedidos:read:admin"))])
async def get_pedido_por_id(session: SessionDep, pedido_id:int):
    try:
        return pedido_service.consultar_pedido_id(session=session, id=pedido_id)
    except PedidoNoEncontrado as error:
        raise HTTPException(status_code=404, detail=error.message)


@router.patch('/pedidos/{pedido_id}', response_model=PedidoPublic)
async def patch_pedido(
    session: SessionDep,
    pedido_id: int,
    pedido_update: PedidoUpdate,
    current_user=Depends(permisos.require_permission("pedidos:update:admin")),
):
    try:
        return pedido_service.modificar_pedido(
            session=session,
            id=pedido_id,
            pedido_update=pedido_update,
            user_email=current_user['email'],
        )
    except PedidoNoEncontrado as error:
        raise HTTPException(status_code=404, detail=error.message)