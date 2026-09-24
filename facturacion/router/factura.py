from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException, Response
from fastapi_pagination import Page, Params

from database.engine import SessionDep
from exceptions.factura import (
    FacturaNoAutorizadaError,
    FacturaNoEncontradaError,
    FacturaNoReintentableError,
    FacturaYaEmitidaError,
)
from models.factura import EstadoFactura
from schemas.factura import FacturaCreate, FacturaPublic
from services.consultas_facturacion_service import ConsultasFacturacionService
from services.facturacion_service import FacturacionService
from utils.auth import servicio_interno
from utils.permisos import permisos


router = APIRouter()
# Comandos fiscales (registro, emision, reintentos) y consultas administrativas,
# separados (CQRS liviano) para no mezclar el procesamiento fiscal con lecturas.
facturacion_service = FacturacionService()
consultas_service = ConsultasFacturacionService()


def _respuesta_pdf(servicio, session, factura_id: int, email: str | None = None) -> Response:
    """Arma la descarga del PDF del comprobante, mapeando los errores de dominio.

    Se define como funcion sync (y los endpoints de PDF tambien) para que FastAPI la
    corra en el threadpool: la generacion del PDF es CPU-bound y no debe bloquear el
    event loop del servicio.
    """
    try:
        contenido, nombre = servicio.generar_pdf(session=session, factura_id=factura_id, email=email)
    except FacturaNoEncontradaError as error:
        raise HTTPException(status_code=404, detail=error.message)
    except FacturaNoAutorizadaError as error:
        raise HTTPException(status_code=409, detail=error.message)

    return Response(
        content=contenido,
        media_type='application/pdf',
        headers={'Content-Disposition': f'attachment; filename="{nombre}"'},
    )


@router.post('/facturas/', response_model=FacturaPublic, dependencies=[Depends(servicio_interno)])
async def post_factura(session: SessionDep, datos: FacturaCreate, background_tasks: BackgroundTasks):
    """Evento service-to-service: api_tienda avisa que un pedido quedo pagado.

    Responde siempre 200 (idempotente). La emision del CAE se encola en background:
    la latencia o la caida de ARCA nunca afectan a la tienda.
    """
    factura = facturacion_service.registrar_pedido_pagado(session=session, datos=datos)

    if factura.cae is None:
        # Nunca dentro del ciclo del request: emitir_cae abre sus propias sesiones
        facturacion_service.encolar_emision(factura.id, background_tasks)

    return factura


@router.post('/facturas/procesar-pendientes', dependencies=[Depends(permisos.require_permission('facturas:update:admin'))])
async def post_procesar_pendientes(session: SessionDep, background_tasks: BackgroundTasks):
    """Barrida manual de emision: reclama atomicamente las facturas con intento vencido
    y las `procesando` huerfanas (timeout excedido) y las encola.

    Es seguro llamarlo concurrentemente desde varias instancias: el claim es atomico y
    cada factura la procesa un solo worker. Permite drenar la cola sin esperar un
    scheduler externo.
    """
    ids = facturacion_service.reclamar_procesando_vencidas(session) + facturacion_service.reintentar_pendientes(session)
    for factura_id in ids:
        facturacion_service.encolar_emision(factura_id, background_tasks)
    return {'reclamadas': len(ids), 'ids': ids}


@router.get('/facturas/', response_model=Page[FacturaPublic], dependencies=[Depends(permisos.require_permission('facturas:read:admin'))])
async def get_facturas(
    session: SessionDep,
    estado: EstadoFactura | None = None,
    numero_pedido: str | None = None,
    user_email: str | None = None,
    params: Params = Depends(),
):
    return consultas_service.listar_facturas(
        session=session,
        estado=estado,
        numero_pedido=numero_pedido,
        user_email=user_email,
        params=params,
    )


@router.get('/facturas/pedido/{pedido_id}', response_model=FacturaPublic, dependencies=[Depends(permisos.require_permission('facturas:read:admin'))])
async def get_factura_por_pedido(session: SessionDep, pedido_id: int):
    factura = consultas_service.obtener_por_pedido(session=session, pedido_id=pedido_id)
    if factura is None:
        raise HTTPException(status_code=404, detail=f'El pedido {pedido_id} no tiene factura registrada')
    return factura


@router.get('/facturas/{factura_id}', response_model=FacturaPublic, dependencies=[Depends(permisos.require_permission('facturas:read:admin'))])
async def get_factura_por_id(session: SessionDep, factura_id: int):
    try:
        return consultas_service.obtener_por_id(session=session, factura_id=factura_id)
    except FacturaNoEncontradaError as error:
        raise HTTPException(status_code=404, detail=error.message)


@router.get('/facturas/{factura_id}/pdf', dependencies=[Depends(permisos.require_permission('facturas:read:admin'))])
def get_factura_pdf(session: SessionDep, factura_id: int):
    """PDF fiscal del comprobante autorizado (con el QR de la RG 4290), para el panel admin."""
    return _respuesta_pdf(consultas_service, session=session, factura_id=factura_id)


@router.get('/mis-facturas', response_model=Page[FacturaPublic])
async def get_mis_facturas(
    session: SessionDep,
    params: Params = Depends(),
    current_user=Depends(permisos.require_permission('facturas:read:own')),
):
    return consultas_service.listar_por_usuario(
        session=session,
        user_email=current_user['email'],
        params=params,
    )


@router.get('/mis-facturas/{factura_id}/pdf')
def get_mi_factura_pdf(
    session: SessionDep,
    factura_id: int,
    current_user=Depends(permisos.require_permission('facturas:read:own')),
):
    """PDF del comprobante propio: se valida que la factura sea del email del token.

    Si la factura es de otro cliente responde 404 (no se revela su existencia).
    """
    return _respuesta_pdf(consultas_service, session=session, factura_id=factura_id, email=current_user['email'])


@router.post('/facturas/{factura_id}/reintentar', response_model=FacturaPublic)
async def post_reintentar(
    session: SessionDep,
    factura_id: int,
    background_tasks: BackgroundTasks,
    _=Depends(permisos.require_permission('facturas:update:admin')),
):
    try:
        factura = facturacion_service.reintentar(session=session, factura_id=factura_id)
    except FacturaNoEncontradaError as error:
        raise HTTPException(status_code=404, detail=error.message)
    except FacturaYaEmitidaError as error:
        raise HTTPException(status_code=409, detail=error.message)
    except FacturaNoReintentableError as error:
        raise HTTPException(status_code=400, detail=error.message)

    facturacion_service.encolar_emision(factura.id, background_tasks)
    return factura
