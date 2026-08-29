from exceptions.base import BusinessError


class ProductoNoEncontradoError(BusinessError):
    def __init__(self, identifier: str | int):
            super().__init__(
                message=f"Producto con ID: '{identifier}' no encontrado",
                code="PRODUCTO_NOT_FOUND" 
            )


class StockInsuficienteError(BusinessError):
    def __init__(self, producto_nombre: str, stock_disponible: int, solicitado: int):
        super().__init__(
            message=f"Stock insuficiente para '{producto_nombre}'. Disponible: {stock_disponible}, solicitado: {solicitado}",
            code="STOCK_INSUFICIENTE" 
        )


class DescuentoNoValido(BusinessError):
     def __init__(self):
          super().__init__(
               message="El precio del descuento no puede ser mayor al precio original",
               code="DECUENTO_NO_VALIDO"
          )