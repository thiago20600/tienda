"""Notificación fire-and-forget al microservicio de facturación.

Principio de aislamiento: si facturación (o ARCA) está caído, la tienda sigue
vendiendo. El evento se encola en BackgroundTasks y todo error se loguea sin
propagarse al request que está atendiendo el pago.
"""
import logging

import httpx
from fastapi import BackgroundTasks
from sqlmodel import Session, select

from config import settings
from models.pedido import DetallePedido, MetodoPago, Pedido

logger = logging.getLogger(__name__)


def notificar_facturacion(background_tasks: BackgroundTasks, session: Session, pedido_id: int) -> None:
    """Encola el evento 'pedido pagado' hacia api_facturacion.

    Si API_FACTURACION_URL no está configurada, no hace nada (compatibilidad
    hacia atrás: la tienda funciona igual sin facturación). El payload es el
    snapshot contable del pedido: facturación no consulta a la tienda.
    """
    if not settings.API_FACTURACION_URL:
        return

    pedido = session.get(Pedido, pedido_id)
    if pedido is None:
        logger.warning('No se encontró el pedido %s para notificar a facturación', pedido_id)
        return

    detalles = session.exec(select(DetallePedido).where(DetallePedido.pedido_id == pedido.id)).all()

    payload = {
        'pedido_id': pedido.id,
        'numero_pedido': pedido.numero_pedido or f'pedido-{pedido.id}',
        'user_email': pedido.user_email,
        'metodo_pago': pedido.metodo_pago.value if isinstance(pedido.metodo_pago, MetodoPago) else str(pedido.metodo_pago),
        'precio_total': str(pedido.precio_total),
        'detalles': [
            {
                'producto_id': detalle.producto_id,
                'descripcion': detalle.producto.nombre if detalle.producto else None,
                'cantidad': detalle.cantidad,
                'precio_unitario': str(detalle.precio_unitario),
                'subtotal': str(detalle.subtotal),
            }
            for detalle in detalles
        ],
    }

    background_tasks.add_task(_enviar_evento, payload)


def _enviar_evento(payload: dict) -> None:
    """POST service-to-service autenticado con X-Internal-Key. Un fallo NUNCA se propaga."""
    url = f"{settings.API_FACTURACION_URL}/facturas/"
    try:
        response = httpx.post(
            url,
            json=payload,
            headers={'X-Internal-Key': settings.TOKEN_SERVICIO_INTERNO_API},
            timeout=10.0,
        )
        if response.status_code >= 400:
            logger.warning(
                'Facturación rechazó el evento del pedido %s: %s %s',
                payload.get('pedido_id'), response.status_code, response.text[:200],
            )
    except Exception:
        logger.exception(
            'No se pudo notificar a facturación el pedido %s (la tienda sigue funcionando)',
            payload.get('pedido_id'),
        )