from exceptions.base import BusinessError


class ItemNoEncontradoError(BusinessError):
    def __init__(self, carrito_id: str | int, producto_id: str | int):
        super().__init__(
            message=f"El producto con ID: '{producto_id}' no fue encontrado en el carrito con ID: '{carrito_id}'",
            code="ITEM_NOT_FOUND" 
        )

class StockInsuficienteError(BusinessError):
    def __init__(self, producto_nombre: str, stock_disponible: int, solicitado: int):
        super().__init__(
            message=f"Stock insuficiente para '{producto_nombre}'. Disponible: {stock_disponible}, solicitado: {solicitado}",
            code="STOCK_INSUFICIENTE" 
        )

class CarritoNoEncontradoError(BusinessError):
    def __init__(self, usuario_identificador: str | int):
        super().__init__(
            message=f"No se encontró un carrito activo para el usuario '{usuario_identificador}'",
            code="CARRITO_NOT_FOUND"
        )