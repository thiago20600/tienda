from datetime import datetime, timezone
import uuid
from database.engine import SessionDep
from models.carrito import Carrito, EstadoCarrito
from models.pedido import DetallePedido, MetodoPago, Pedido


def crear_pedido(session: SessionDep, carrito: Carrito, metodo_pago: MetodoPago, user_email: str):
    for item in carrito.items:
        item.precio_unitario = item.producto.precio_descuento or item.producto.precio
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
    session.add(pedido) # Actualizamos el pedido con su número de orden

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

