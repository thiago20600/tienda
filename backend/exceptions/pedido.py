from exceptions.base import BusinessError

class PedidoNoEncontrado(BusinessError):
    def __init__(self, id: int):
        super().__init__(message=f'No se encontro el pedido con id: {id}',
                         code='PEDIDO_NOT_FOUND')

        