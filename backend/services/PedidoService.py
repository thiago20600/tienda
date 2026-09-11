from datetime import datetime, timezone
from fastapi import HTTPException
from models.pedido import EstadoPedido, Pedido, PedidoUpdate
from exceptions.pedido import PedidoNoEncontrado
from sqlmodel import Session, select
from fastapi_pagination import Params
from fastapi_pagination.ext.sqlmodel import paginate


class PedidoService:

    def consultar_pedidos(
        self,
        session: Session,
        user_email: str | None = None,
        numero_pedido: str | None = None,
        estado: str | None = None,
        metodo_pago: str | None = None,
        precio_total: str | None = None,
        params: Params | None = None
    ):
        query = select(Pedido)

        if user_email is not None and user_email.strip():
            query = query.where(Pedido.user_email.ilike(f'%{user_email.strip()}%'))

        if numero_pedido is not None and numero_pedido.strip():
            query = query.where(Pedido.numero_pedido.ilike(f'%{numero_pedido.strip()}%'))

        if estado is not None and estado.strip():
            query = query.where(Pedido.estado == estado.strip())

        if metodo_pago is not None and metodo_pago.strip():
            query = query.where(Pedido.metodo_pago == metodo_pago.strip())

        if precio_total is not None and precio_total.strip():
            query = query.where(Pedido.precio_total == float(precio_total.strip()))

        if params is not None:
            return paginate(session, query, params)

        return session.exec(query).all()

    def consultar_pedido_id(self, session: Session, id: int) -> Pedido:
        pedido = session.get(Pedido, id)
        if not pedido:
            raise PedidoNoEncontrado(id=id)
        return pedido

    def modificar_pedido(self, session: Session, id: int, pedido_update: PedidoUpdate, user_email: str | None = None) -> Pedido:
        pedido = self.consultar_pedido_id(session=session, id=id)

        self._validar_modificable(pedido)
        self._aplicar_cambios(pedido, pedido_update)
        pedido.updated_by_email = user_email
        self._actualizar_timestamps(pedido)

        session.add(pedido)
        session.commit()
        session.refresh(pedido)

        return pedido


    def _validar_modificable(self, pedido: Pedido) -> None:
        if pedido.estado in (EstadoPedido.entregado, EstadoPedido.cancelado, EstadoPedido.rechazado):
            raise HTTPException(status_code=400, detail='No se puede modificar un pedido entregado, rechazado o cancelado')


    def _aplicar_cambios(self, pedido: Pedido, pedido_update: PedidoUpdate) -> None:
        for key, value in pedido_update.model_dump(exclude_unset=True).items():
            setattr(pedido, key, value)


    def _actualizar_timestamps(self, pedido: Pedido) -> None:
        pedido.updated_at = datetime.now(timezone.utc)
        if pedido.estado == EstadoPedido.cancelado:
            pedido.canceled_at = datetime.now(timezone.utc)
        elif pedido.estado == EstadoPedido.entregado:
            pedido.entregado_at = datetime.now(timezone.utc)