from datetime import datetime, timezone
from fastapi import HTTPException
from models.pedido import EstadoPedido, Pedido, PedidoUpdate
from exceptions.pedido import PedidoNoEncontrado
from sqlmodel import Session, select


class PedidoService:

    def consultar_pedidos(self, session: Session) -> list[Pedido]:
        return session.exec(select(Pedido)).all()

    def consultar_pedido_id(self, session: Session, id: int) -> Pedido:
        pedido = session.get(Pedido, id)
        if not pedido:
            raise PedidoNoEncontrado(id=id)
        return pedido

    def modificar_pedido(self, session: Session, id: int, pedido_update: PedidoUpdate) -> Pedido:
        pedido = self.consultar_pedido_id(session=session, id=id)

        self._validar_modificable(pedido)
        self._aplicar_cambios(pedido, pedido_update)
        self._actualizar_timestamps(pedido)

        session.add(pedido)
        session.commit()
        session.refresh(pedido)

        return pedido


    def _validar_modificable(self, pedido: Pedido) -> None:
        if pedido.estado in (EstadoPedido.entregado, EstadoPedido.cancelado):
            raise HTTPException(status_code=400, detail='No se puede modificar un pedido entregado o cancelado')


    def _aplicar_cambios(self, pedido: Pedido, pedido_update: PedidoUpdate) -> None:
        for key, value in pedido_update.model_dump(exclude_unset=True).items():
            setattr(pedido, key, value)


    def _actualizar_timestamps(self, pedido: Pedido) -> None:
        pedido.updated_at = datetime.now(timezone.utc)
        if pedido.estado == EstadoPedido.cancelado:
            pedido.canceled_at = datetime.now(timezone.utc)
        elif pedido.estado == EstadoPedido.entregado:
            pedido.entregado_at = datetime.now(timezone.utc)