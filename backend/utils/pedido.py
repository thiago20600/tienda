from datetime import datetime, timezone
import uuid
from sqlmodel import select
from database.engine import SessionDep
from exceptions.producto import ProductoNoEncontradoError
from models.carrito import Carrito, EstadoCarrito
from models.pedido import DetallePedido, MetodoPago, Pedido
from models.productos import Producto


def crear_pedido(session: SessionDep, carrito: Carrito, metodo_pago: MetodoPago, user_email: str):
    if not carrito.items:
        raise ValueError("El carrito está vacío")

    producto_ids = [item.producto_id for item in carrito.items]
    productos = session.exec(
        select(Producto)
        .where(Producto.id.in_(producto_ids))
        .with_for_update()
    ).all()
    productos_por_id = {producto.id: producto for producto in productos}

    for item in carrito.items:
        producto = productos_por_id.get(item.producto_id)
        if not producto:
            raise ProductoNoEncontradoError(item.producto_id)
        if not producto.producto_activo or producto.eliminado_at is not None:
            raise ProductoNoEncontradoError(item.producto_id)

        item.precio_unitario = producto.precio_descuento or producto.precio
        session.add(item)

    total = sum(item.cantidad * item.precio_unitario for item in carrito.items)

    pedido = Pedido(
        carrito_id=carrito.id,
        user_email=user_email,
        metodo_pago=metodo_pago,
        precio_total=total,
        idempotency_key=str(uuid.uuid4())
    )
    session.add(pedido)
    session.flush()

    fecha_pedido = datetime.now(timezone.utc).strftime("%Y%m")
    pedido.numero_pedido = f"PED-{fecha_pedido}-{pedido.id:04d}"
    session.add(pedido)

    for item in carrito.items:
        subtotal = item.cantidad * item.precio_unitario
        detalle_pedido = DetallePedido(
            pedido_id=pedido.id,
            producto_id=item.producto_id,
            cantidad=item.cantidad,
            precio_unitario=item.precio_unitario,
            subtotal=subtotal
        )
        session.add(detalle_pedido)

    return pedido

