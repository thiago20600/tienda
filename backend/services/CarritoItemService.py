from services.ProductoService import OperacionStock, ProductoService
from exceptions.carrito import ItemNoEncontradoError
from sqlmodel import Session, select
from models.carrito import Carrito, CarritoItem
from enum import Enum

class OperacionCantidadItem(Enum):
    AUMENTAR = 'AUMENTAR'
    RESTAR = 'RESTAR'


class CarritoItemService:

    def __init__(self, producto_service: ProductoService | None = None):
        self.producto_service = producto_service or ProductoService()

    def consultar_item(self, session: Session, carrito_id: int, producto_id: int) -> CarritoItem:

        item = session.exec(select(CarritoItem).where(CarritoItem.carrito_id == carrito_id,
                                                      CarritoItem.producto_id == producto_id)).first()

        if not item:
            raise ItemNoEncontradoError(carrito_id=carrito_id, producto_id=producto_id)

        return item


    def crear_item(self, session: Session, carrito_id: int, producto_id: int, precio_unitario: float, cantidad: int) -> CarritoItem:
        item = CarritoItem(carrito_id=carrito_id,
                           producto_id=producto_id,
                           precio_unitario=precio_unitario,
                           cantidad=cantidad)

        session.add(item)
        
        return item



    def actualizar_cantidad(self, item: CarritoItem, cantidad_nueva: int, operacion_item: OperacionCantidadItem) -> CarritoItem:

        if cantidad_nueva <= 0:
            raise ValueError("La cantidad a modificar debe ser un número positivo.")

        
        match operacion_item:
            case OperacionCantidadItem.AUMENTAR:
                item.cantidad += cantidad_nueva
            case OperacionCantidadItem.RESTAR:
                if item.cantidad - cantidad_nueva < 0:
                    raise ValueError(f"No se puede restar {cantidad_nueva} unidades porque solo hay {item.cantidad} en el carrito.")
                item.cantidad -= cantidad_nueva
            case _:
                raise ValueError('Operacion no valida')

        return item


    def eliminar_item(self, item: CarritoItem, session: Session) -> Carrito:

        producto = self.producto_service.consultar_producto(session=session, producto_id=item.producto_id)
        self.producto_service.actualizar_stock(producto=producto, cantidad=item.cantidad, operacion=OperacionStock.AUMENTAR)
        carrito = item.carrito
        session.delete(item)
        return carrito

        

