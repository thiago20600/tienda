from services.CarritoItemService import CarritoItemService, OperacionCantidadItem
from services.ProductoService import OperacionStock, ProductoService
from exceptions.carrito import CarritoNoEncontradoError, ItemNoEncontradoError
from sqlmodel import Session, select
from models.carrito import Carrito, EstadoCarrito


class CarritoService:

    def __init__(self, producto_service: ProductoService | None = None, carrito_item_service: CarritoItemService | None = None):
        self.producto_service = producto_service or ProductoService()
        self.carrito_item_service = carrito_item_service or CarritoItemService(producto_service=self.producto_service)


    def consultar_carrito(self, session: Session, usuario_email: str) -> Carrito:
        carrito = session.exec(select(Carrito).where(Carrito.user_email == usuario_email, Carrito.estado == EstadoCarrito.abierto)).first()
        if not carrito:
            raise CarritoNoEncontradoError(usuario_email)

        self._actualizar_precio_carrito(session=session, carrito=carrito)
        return carrito


    def _actualizar_precio_carrito(self, session: Session, carrito: Carrito) -> None:
        precios_actualizados = False
        for item in carrito.items:
            precio_actual = item.producto.precio_descuento or item.producto.precio
            if item.precio_unitario != precio_actual:
                item.precio_unitario = precio_actual
                session.add(item)
                precios_actualizados = True

        if precios_actualizados:
            session.commit()
            session.refresh(carrito)
    

    def crear_carrito(self, session: Session, usuario_email: str) -> Carrito:
        carrito = Carrito(user_email=usuario_email)
        session.add(carrito)
        session.flush()
        return carrito
    

    def actualizar_cantidad(self, session: Session, usuario_email: str, producto_id: int, nueva_cantidad: int) -> Carrito:
        if nueva_cantidad <= 0:
            raise ValueError("La cantidad debe ser mayor a cero")

        carrito = self.consultar_carrito(session=session, usuario_email=usuario_email)
        producto = self.producto_service.consultar_producto(session=session, producto_id=producto_id)
        item = self.carrito_item_service.consultar_item(session=session, carrito_id=carrito.id, producto_id=producto_id)

        diferencia = nueva_cantidad - item.cantidad
        operacion_stock = OperacionStock.RESTAR if diferencia > 0 else OperacionStock.AUMENTAR
        operacion_item = OperacionCantidadItem.AUMENTAR if diferencia > 0 else OperacionCantidadItem.RESTAR

        self.producto_service.actualizar_stock(producto=producto, cantidad=abs(diferencia), operacion=operacion_stock)
        self.carrito_item_service.actualizar_cantidad(item=item, cantidad_nueva=abs(diferencia), operacion_item=operacion_item)

        session.commit()
        session.refresh(item)
        session.refresh(carrito)
        return carrito
    

    def agregar_producto(self, session: Session, usuario_email: str, producto_id: int, cantidad: int) -> Carrito:
        if cantidad <= 0:
            raise ValueError("La cantidad debe ser mayor a cero")

        try:
            carrito = self.consultar_carrito(session=session, usuario_email=usuario_email)
        except CarritoNoEncontradoError:
            carrito = self.crear_carrito(session=session, usuario_email=usuario_email)

        producto = self.producto_service.consultar_producto(session=session, producto_id=producto_id)
        self.producto_service.actualizar_stock(producto=producto, cantidad=cantidad, operacion=OperacionStock.RESTAR)

        try:
            item = self.carrito_item_service.consultar_item(session=session, carrito_id=carrito.id, producto_id=producto.id)
            self.carrito_item_service.actualizar_cantidad(item=item, cantidad_nueva=cantidad, operacion_item=OperacionCantidadItem.AUMENTAR)
        except ItemNoEncontradoError:
            precio_unitario = producto.precio_descuento or producto.precio
            self.carrito_item_service.crear_item(session=session, carrito_id=carrito.id, producto_id=producto.id, precio_unitario=precio_unitario, cantidad=cantidad)

        session.commit()
        session.refresh(carrito)
        return carrito