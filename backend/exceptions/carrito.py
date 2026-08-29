from exceptions.base import BusinessError


class ItemNoEncontradoError(BusinessError):
    def __init__(self, carrito_id: str | int, producto_id: str | int):
        super().__init__(
            message=f"El producto con ID: '{producto_id}' no fue encontrado en el carrito con ID: '{carrito_id}'",
            code="ITEM_NOT_FOUND" 
        )

class CarritoNoEncontradoError(BusinessError):
    def __init__(self, usuario_identificador: str | int):
        super().__init__(
            message=f"No se encontró un carrito activo para el usuario '{usuario_identificador}'",
            code="CARRITO_NOT_FOUND"
        )