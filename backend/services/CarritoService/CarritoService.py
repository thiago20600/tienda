from services.CarritoService.CarritoItemService import CarritoItemService, OperacionCantidadItem
from services.ProductoService.ProductoService import OperacionStock, ProductoService
from database.engine import SessionDep
from exceptions.carrito import CarritoNoEncontradoError, ItemNoEncontradoError, StockInsuficienteError
from sqlmodel import Session, select
from models.carrito import Carrito, EstadoCarrito
from models.carrito import CarritoItem
from models.productos import Producto

class CarritoService:

    def __init__(self,
        producto_service: ProductoService | None = None,
        carrito_item_service: CarritoItemService | None = None):

        self.producto_service = producto_service or ProductoService()
        self.carrito_item_service = carrito_item_service or CarritoItemService(producto_service=self.producto_service)

    def actualizar_cantidad(self, session: Session, usuario_email: str, producto_id: int, nueva_cantidad: int) -> Carrito:
        # 1. Validar cantidad
        if nueva_cantidad <= 0:
            raise ValueError("La cantidad debe ser mayor a cero")

        # 2. Obtener carrito activo
        carrito = self.consultar_carrito(session=session, usuario_email=usuario_email)

        # 3. Obtener producto y calcular diferencia
        producto = self.producto_service.consultar_producto(session=session, producto_id=producto_id)

        # 4. Obtener item del carrito
        item = self.carrito_item_service.consultar_item(session=session, carrito_id=carrito.id, producto_id=producto_id)

        # 5. calcular diferencia
        cantidad_vieja = item.cantidad
        diferencia = nueva_cantidad - cantidad_vieja

        if diferencia > 0:
            self.producto_service.actualizar_stock(
                producto=producto,
                cantidad=diferencia,
                operacion=OperacionStock.RESTAR
            )
        else:
            self.producto_service.actualizar_stock(
                producto=producto,
                cantidad=abs(diferencia),
                operacion=OperacionStock.AUMENTAR
            )

        # 7. Actualizar item
        if diferencia > 0:
            self.carrito_item_service.actualizar_cantidad(
                item=item,
                cantidad_nueva=diferencia,
                operacion_item=OperacionCantidadItem.AUMENTAR
            )
        else:
            self.carrito_item_service.actualizar_cantidad(
                item=item,
                cantidad_nueva=abs(diferencia),
                operacion_item=OperacionCantidadItem.RESTAR
            )

        session.commit()
        session.refresh(item)
        session.refresh(carrito)
        return carrito


    def consultar_carrito(self, session: Session, usuario_email: str) -> Carrito:
        carrito = session.exec(select(Carrito).where(Carrito.user_email == usuario_email,
                                                    Carrito.estado == EstadoCarrito.abierto)).first()
        if not carrito:
            raise CarritoNoEncontradoError(usuario_email)
        return carrito


    def crear_carrito(self, session: Session, usuario_email: str) -> Carrito:
        carrito = Carrito(usuario_email)

        session.add(carrito)
        session.flush()
        return carrito


    def agregar_producto(self, session: Session, usuario_email: str, producto_id: int, cantidad: int) -> Carrito:
        # 1. Validar cantidad
        if cantidad <= 0:
            raise ValueError("La cantidad debe ser mayor a cero")

        # 2. Obtener o crear carrito activo
        try:
            carrito = self.consultar_carrito(session=session, usuario_email=usuario_email)
        except CarritoNoEncontradoError:
            carrito = self.crear_carrito(session=session, usuario_email=usuario_email)

        # 3. Obtener producto y validar stock
        producto = self.producto_service.consultar_producto(session=session, producto_id=producto_id)
        self.producto_service.actualizar_stock(producto=producto, cantidad=cantidad, operacion=OperacionStock.RESTAR)

        # 4. Buscar item en el carrito o crearlo
        try:
            item = self.carrito_item_service.consultar_item(session=session, carrito_id=carrito.id, producto_id=producto.id)
            self.carrito_item_service.actualizar_cantidad(item=item, cantidad_nueva=cantidad, operacion_item=OperacionCantidadItem.AUMENTAR)
        except ItemNoEncontradoError:
            self.carrito_item_service.crear_item(session=session, carrito_id=carrito.id, producto_id=producto.id, precio_unitario=producto.precio, cantidad=cantidad)

        session.commit()
        session.refresh(carrito)
        return carrito


    


    