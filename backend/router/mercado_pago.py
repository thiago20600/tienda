from fastapi import APIRouter, Depends, HTTPException
import mercadopago
from sqlmodel import select
from config import settings
from database.engine import SessionDep
from models.carrito import Carrito, EstadoCarrito
from models.checkout import CheckoutSchema
from models.pedido import DetallePedido, EstadoPedido, MetodoPago, Pedido, PedidoPublic
from utils.auth import get_current_user
import httpx
from utils.pedido import crear_pedido

router = APIRouter()

sdk = mercadopago.SDK(f"{settings.MP_ACCESS_TOKEN}")


@router.get('/metodos-pago')
async def obetener_metodos_pago():
    try:
        response = sdk.payment_methods().list_all()
        payment_methods = response["response"]

        return payment_methods
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))



@router.post('/crear-orden', response_model=PedidoPublic)
async def procesar_pago(session: SessionDep, checkout_data: CheckoutSchema, current_user=Depends(get_current_user)):
    nombre_tienda = 'tienda X'
    carrito_procesar = session.exec(select(Carrito).where(current_user['email'] == Carrito.user_email,
                                                          Carrito.estado == EstadoCarrito.abierto)).first()

    if not carrito_procesar:
        raise HTTPException(status_code=404, detail='Carrito no encontrado')

    url_mp = 'https://api.mercadopago.com/v1/orders'

    pedido_pendiente = session.exec(select(Pedido).where(Pedido.estado == EstadoPedido.pendiente,
                                                         Pedido.user_email == current_user['email'],
                                                         Pedido.carrito_id == carrito_procesar.id)).first()

    if pedido_pendiente:
        pedido = pedido_pendiente
    else:
        pedido = crear_pedido(session=session, carrito=carrito_procesar, metodo_pago=MetodoPago.tarjeta, user_email=current_user['email'])

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
    print("payment_method_type recibido:", checkout_data.payment_method_type)


    print("llega hasta linea 68")
    MAPEO_PAYMENT_TYPE = {
    'prepaid_card': 'credit_card',
    'credit_card': 'credit_card',
    'debit_card': 'debit_card',
    'account_money': 'account_money',
    'digital_currency': 'digital_currency',
    'wallet': 'wallet',
    }

    print("llega hasta linea 78")
    payment_method_type_normalizado = MAPEO_PAYMENT_TYPE.get(
        checkout_data.payment_method_type,
        checkout_data.payment_method_type
    )


    print("llega hasta linea 85")
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
            'email': 'test_user_7462683053663058125@testuser.com', #current_user['email']
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
    print("llega hasta linea 146")
    async with httpx.AsyncClient() as client:
        response = await client.post(url_mp, json=payload_mp, headers=headers)


    print("llega hasta linea 149")
    if response.status_code not in [200, 201]:
        pedido.estado = EstadoPedido.rechazado
        session.add(pedido)
        session.commit()
        print("llega hasta linea 156")
        try:
            print("llega hasta linea 158")
            error_data = response.json()
        except Exception:
            print("llega hasta linea 160")
            error_data = {"message": "Error al procesar el pago en la pasarela"}

        print("llega hasta linea 164")
        print("ERROR DE MERCADOPAGO:", error_data)
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
    print(data_mp)
    session.add(carrito_procesar)
    session.add(pedido)
    session.commit()
    session.refresh(pedido)

    return pedido