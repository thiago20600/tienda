from models.productos import Producto
from sqlmodel import Session
from exceptions.producto import ProductoNoEncontradoError, StockInsuficienteError
from enum import Enum

class OperacionStock(Enum):
    AUMENTAR = 'AUMENTAR'
    RESTAR = 'RESTAR'


class ProductoService:


    def consultar_producto(self, session:Session, producto_id: int) -> Producto:
        producto = session.get(Producto, producto_id)
        if not producto:
            raise ProductoNoEncontradoError(producto_id)

        return producto


    def actualizar_stock(self, producto: Producto, cantidad: int, operacion: OperacionStock) -> Producto:
	
        
        match operacion:
            case OperacionStock.AUMENTAR:
                producto.stock += cantidad
            case OperacionStock.RESTAR:
                if producto.stock < cantidad:
                    raise StockInsuficienteError(producto.nombre, producto.stock, cantidad)
                producto.stock -= cantidad
            case _:
                raise ValueError("Operación de stock no válida")
        
        return producto