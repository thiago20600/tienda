import hashlib
import hmac
import json

import httpx
import mercadopago
from fastapi import APIRouter, Depends, HTTPException, Request
from sqlmodel import select

from config import settings
from database.engine import SessionDep
from exceptions.producto import ProductoNoEncontradoError, StockInsuficienteError
from models.carrito import Carrito, EstadoCarrito
from models.checkout import CheckoutSchema
from models.pedido import DetallePedido, EstadoPedido, MetodoPago, Pedido, PedidoPublic
from services.ConfiguracionService import ConfiguracionService
from utils.pedido import crear_pedido
from utils.permisos import permisos

router = APIRouter()

sdk = mercadopago.SDK(f"{settings.MP_ACCESS_TOKEN}")


@router.get('/metodos-pago')
async def obtener_metodos_pago():
    try:
        response = sdk.payment_methods().list_all()
        payment_methods = response["response"]

        return payment_methods
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))



@router.post('/crear-orden', response_model=PedidoPublic)
async def procesar_pago(session: SessionDep, checkout_data: CheckoutSchema, current_user=Depends(permisos.require_permission("pedidos:create:own"))):
    nombre_tienda = ConfiguracionService().obtener_configuracion(session=session).nombre_tienda
    carrito_procesar = session.exec(select(Carrito).where(current_user['email'] == Carrito.user_email,
                                                          Carrito.estado == EstadoCarrito.abierto)).first()

    if not carrito_procesar:
        raise HTTPException(status_code=404, detail='Carrito no encontrado')

    url_mp = 'https://api.mercadopago.com/v1/orders'

    pedido_pendiente = session.exec(select(Pedido).where(Pedido.estado == EstadoPedido.pendiente,
                                                         Pedido.user_email == current_user['email'],
                                                         Pedido.carrito_id == carrito_procesar.id)).first()

    if not pedido_pendiente:
        try:
            pedido = crear_pedido(session=session, carrito=carrito_procesar, metodo_pago=MetodoPago.tarjeta, user_email=current_user['email'])
        except StockInsuficienteError as e:
            raise HTTPException(status_code=409, detail=str(e))
        except ProductoNoEncontradoError as e:
            raise HTTPException(status_code=404, detail=str(e))
        except ValueError as e:
            raise HTTPException(status_code=400, detail=str(e))
    else:
        pedido = pedido_pendiente

    detalles_pedido = session.exec(select(DetallePedido).where(DetallePedido.pedido_id == pedido.id)).all()

    headers = {
        "Authorization": f"Bearer {settings.MP_ACCESS_TOKEN}",
        "Content-Type": "application/json",
        "X-Idempotency-Key": pedido.idempotency_key
    }

    lista_items = []
    for item in detalles_pedido:
        lista_items.append({
            'title': item.producto.nombre,
            'unit_price': str(item.precio_unitario),
            'quantity': item.cantidad,
        })

    MAPEO_PAYMENT_TYPE = {
    'prepaid_card': 'credit_card',
    'credit_card': 'credit_card',
    'debit_card': 'debit_card',
    'account_money': 'account_money',
    'digital_currency': 'digital_currency',
    'wallet': 'wallet',
    }

    payment_method_type_normalizado = MAPEO_PAYMENT_TYPE.get(
        checkout_data.payment_method_type,
        checkout_data.payment_method_type
    )

    payload_mp = {
        'type': 'online',
        'external_reference': pedido.numero_pedido,
        'transactions': {
        'payments': [{
                    'amount': str(pedido.precio_total),
                    'payment_method': {
                    'id': checkout_data.payment_method_id,
                    'type': payment_method_type_normalizado,
                    'token': checkout_data.token_tarjeta,
                    'installments': checkout_data.cuotas,
                    'statement_descriptor': nombre_tienda,
                }
            }]
        },
        'payer': {
            'email': current_user['email'],
            'first_name': checkout_data.nombre,
            'last_name': checkout_data.apellido,
            'identification': {
                'type': checkout_data.tipo_identificacion,
                'number': checkout_data.numero_identificacion
            },
            'phone': {
                'area_code': checkout_data.telefono_area,
                'number': checkout_data.telefono_numero
            },
            'address': {
                'zip_code': checkout_data.codigo_postal,
                'street_name': checkout_data.nombre_calle,
                'street_number': checkout_data.numero_calle,
                'state': checkout_data.provincia,
                'city': checkout_data.localidad,
                'complement': checkout_data.detalle_direccion or "N/A"
            }
        },
        'shipment': {
            'address': {
                    'zip_code': checkout_data.codigo_postal,
                    'street_name': checkout_data.nombre_calle,
                    'street_number': checkout_data.numero_calle,
                    'state': checkout_data.provincia,
                    'city': checkout_data.localidad,
                    'complement': checkout_data.detalle_direccion or "N/A"
            }
        },
        'total_amount': str(pedido.precio_total),
        'capture_mode': 'automatic',
        'processing_mode': 'automatic',
        'description': nombre_tienda,
        'items': lista_items,
        'config': {
                    "online": {
                        "transaction_security": {
                            "validation": "on_fraud_risk",
                            "liability_shift": "required",
                        }
                    }
        }
    }
    async with httpx.AsyncClient() as client:
        response = await client.post(url_mp, json=payload_mp, headers=headers)

    if response.status_code not in [200, 201]:
        pedido.estado = EstadoPedido.rechazado
        session.add(pedido)
        session.commit()
        try:
            error_data = response.json()
        except Exception:
            error_data = {"message": "Error al procesar el pago en la pasarela"}
        raise HTTPException(
            status_code=response.status_code,
            detail=error_data
        )

    data_mp = response.json()

    data_mp_sanitizado = data_mp.copy()
    if data_mp_sanitizado.get('transactions', {}).get('payments'):
        for pago in data_mp_sanitizado['transactions']['payments']:
            pago.get('payment_method', {}).pop('token', None)
    
    pedido.estado = EstadoPedido.pagado
    pedido.mp_payment_id = data_mp['transactions']['payments'][0]['id']
    pedido.mp_response_raw = data_mp_sanitizado
    carrito_procesar.estado = EstadoCarrito.confirmado
    session.add(carrito_procesar)
    session.add(pedido)
    session.commit()
    session.refresh(pedido)

    return pedido


def _validar_firma_mp(firma: str, cuerpo: bytes, request_id: str, secret: str) -> bool:
    if not firma or not secret:
        return False

    partes = dict(par.split('=', 1) for par in firma.split(',') if '=' in par)
    ts = partes.get('ts')
    v1 = partes.get('v1')
    if not ts or not v1:
        return False

    try:
        id_evento = json.loads(cuerpo).get('id') if cuerpo else None
    except ValueError:
        id_evento = None

    dato = f"id:{id_evento};request-id:{request_id};ts:{ts};"
    esperado = hmac.new(secret.encode('utf-8'), dato.encode('utf-8'), hashlib.sha256).hexdigest()
    return hmac.compare_digest(esperado, v1)


@router.post('/crear-orden-efectivo', response_model=PedidoPublic)
async def crear_orden_efectivo(session: SessionDep, current_user=Depends(permisos.require_permission("pedidos:create:own"))):
    carrito_procesar = session.exec(select(Carrito).where(current_user['email'] == Carrito.user_email,
                                                           Carrito.estado == EstadoCarrito.abierto)).first()

    if not carrito_procesar:
        raise HTTPException(status_code=404, detail='Carrito no encontrado')

    pedido_pendiente = session.exec(select(Pedido).where(Pedido.estado == EstadoPedido.pendiente,
                                                          Pedido.metodo_pago == MetodoPago.efectivo,
                                                          Pedido.user_email == current_user['email'],
                                                          Pedido.carrito_id == carrito_procesar.id)).first()

    if pedido_pendiente:
        return pedido_pendiente

    try:
        pedido = crear_pedido(session=session, carrito=carrito_procesar, metodo_pago=MetodoPago.efectivo, user_email=current_user['email'])
    except ProductoNoEncontradoError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

    pedido.estado = EstadoPedido.pendiente
    carrito_procesar.estado = EstadoCarrito.confirmado
    session.add(carrito_procesar)
    session.add(pedido)
    session.commit()
    session.refresh(pedido)
    return pedido


@router.post('/mp/webhook')
async def mp_webhook(session: SessionDep, request: Request):
    cuerpo = await request.body()

    if settings.MP_WEBHOOK_SECRET:
        request_id = request.headers.get('x-request-id', '')
        firma = request.headers.get('x-signature', '')
        if not _validar_firma_mp(firma, cuerpo, request_id, settings.MP_WEBHOOK_SECRET):
            raise HTTPException(status_code=401, detail='Firma inválida')

    if not cuerpo:
        return {'ok': True}

    payload = json.loads(cuerpo)
    datos_evento = payload.get('data') or {}
    id_pago = str(datos_evento.get('id') or '')
    referencia_externa = str(datos_evento.get('external_reference') or payload.get('external_reference') or '')

    pedido = None
    if id_pago and id_pago != 'None':
        pedido = session.exec(select(Pedido).where(Pedido.mp_payment_id == id_pago)).first()
    if pedido is None and referencia_externa:
        pedido = session.exec(select(Pedido).where(Pedido.numero_pedido == referencia_externa)).first()

    if pedido is None:
        return {'ok': True}

    if payload.get('type') == 'payment' and id_pago and id_pago != 'None':
        try:
            detalle = sdk.payment().get(int(id_pago))
            estado_mp = (detalle.get('response') or {}).get('status')
            if estado_mp == 'approved':
                pedido.estado = EstadoPedido.pagado
            elif estado_mp in ('rejected', 'cancelled', 'refunded'):
                pedido.estado = EstadoPedido.rechazado
            else:
                return {'ok': True}

            session.add(pedido)
            session.commit()
        except Exception:
            return {'ok': True}

    return {'ok': True}