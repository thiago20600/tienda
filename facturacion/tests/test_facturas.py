"""Flujo de facturacion: registro del evento de pedido pagado y emision del CAE ante ARCA."""
from datetime import datetime, timedelta, timezone
from decimal import Decimal

import pytest
from config import settings
from models.factura import EstadoFactura, Factura
from schemas.factura import DetalleFacturaCreate, FacturaCreate
from services.facturacion_service import FacturacionService
from sqlmodel import Session


def test_health(client):
    respuesta = client.get('/health')

    assert respuesta.status_code == 200
    assert respuesta.json() == {'status': 'ok'}


def test_evento_sin_header_interno_da_403(client, payload_pedido):
    respuesta = client.post('/facturas/', json=payload_pedido())

    assert respuesta.status_code == 403


def test_evento_con_header_interno_invalido_da_403(client, payload_pedido):
    respuesta = client.post('/facturas/', json=payload_pedido(), headers={'X-Internal-Key': 'clave-invalida'})

    assert respuesta.status_code == 403


def test_registra_el_pedido_y_emite_el_cae(client_admin, payload_pedido, headers_internos, arca_aprobado):
    respuesta = client_admin.post('/facturas/', json=payload_pedido(pedido_id=7), headers=headers_internos)

    assert respuesta.status_code == 200
    # La respuesta sale con el estado inicial: la emision del CAE corre en background
    assert respuesta.json()['estado'] == EstadoFactura.pendiente.value
    factura_id = respuesta.json()['id']

    # Cuando el TestClient devuelve el control, la background task ya corrio
    detalle = client_admin.get(f'/facturas/{factura_id}').json()
    assert detalle['estado'] == EstadoFactura.aprobada.value
    assert detalle['cae'] == '75000000000000'
    assert detalle['numero_comprobante'] == 1
    assert detalle['vencimiento_cae'] == '2026-10-01'
    assert arca_aprobado.llamadas == 1


def test_desglose_de_montos_con_iva_incluido(client_admin, payload_pedido, headers_internos, arca_aprobado):
    respuesta = client_admin.post(
        '/facturas/',
        json=payload_pedido(pedido_id=8, precio_total='121000.00'),
        headers=headers_internos,
    )
    detalle = client_admin.get(f"/facturas/{respuesta.json()['id']}").json()

    assert Decimal(str(detalle['monto_total'])) == Decimal('121000.00')
    assert Decimal(str(detalle['monto_neto'])) == Decimal('100000.00')
    assert Decimal(str(detalle['monto_iva'])) == Decimal('21000.00')


def test_idempotencia_no_factura_dos_veces_el_mismo_pedido(
    client_admin, payload_pedido, headers_internos, arca_aprobado, consultar_facturas,
):
    primera = client_admin.post('/facturas/', json=payload_pedido(pedido_id=10), headers=headers_internos).json()
    segunda = client_admin.post('/facturas/', json=payload_pedido(pedido_id=10), headers=headers_internos).json()

    assert primera['id'] == segunda['id']
    assert len([f for f in consultar_facturas() if f.pedido_id == 10]) == 1
    # Tampoco se vuelve a pedir el CAE
    assert arca_aprobado.llamadas == 1


def test_error_transitorio_deja_la_factura_pendiente(
    client_admin, payload_pedido, headers_internos, arca_error_transitorio,
):
    respuesta = client_admin.post('/facturas/', json=payload_pedido(pedido_id=11), headers=headers_internos)
    detalle = client_admin.get(f"/facturas/{respuesta.json()['id']}").json()

    assert detalle['estado'] == EstadoFactura.pendiente.value
    assert detalle['intentos'] == 1
    assert 'timeout' in detalle['ultimo_error']
    assert detalle['proximo_intento'] is not None
    assert detalle['cae'] is None


def test_agotar_los_intentos_pasa_a_estado_error(
    client_admin, payload_pedido, headers_internos, arca_error_transitorio, monkeypatch,
):
    monkeypatch.setattr(settings, 'FACTURACION_MAX_INTENTOS', 1)

    respuesta = client_admin.post('/facturas/', json=payload_pedido(pedido_id=12), headers=headers_internos)
    detalle = client_admin.get(f"/facturas/{respuesta.json()['id']}").json()

    assert detalle['estado'] == EstadoFactura.error.value
    assert detalle['intentos'] == 1


def test_rechazo_de_arca_no_se_reintenta(client_admin, payload_pedido, headers_internos, arca_rechazo):
    respuesta = client_admin.post('/facturas/', json=payload_pedido(pedido_id=13), headers=headers_internos)
    detalle = client_admin.get(f"/facturas/{respuesta.json()['id']}").json()

    assert detalle['estado'] == EstadoFactura.rechazada.value
    assert '10057' in detalle['ultimo_error']


def test_reintento_manual_reencola_y_emite(client_admin, arca_aprobado, factura_pendiente):
    respuesta = client_admin.post(f'/facturas/{factura_pendiente.id}/reintentar')

    assert respuesta.status_code == 200
    assert respuesta.json()['estado'] == EstadoFactura.pendiente.value

    detalle = client_admin.get(f'/facturas/{factura_pendiente.id}').json()
    assert detalle['estado'] == EstadoFactura.aprobada.value
    assert detalle['numero_comprobante'] == 1


def test_reintento_de_factura_ya_aprobada_da_409(client_admin, payload_pedido, headers_internos, arca_aprobado):
    respuesta = client_admin.post('/facturas/', json=payload_pedido(pedido_id=14), headers=headers_internos)

    reintento = client_admin.post(f"/facturas/{respuesta.json()['id']}/reintentar")

    assert reintento.status_code == 409


def test_reintento_de_factura_inexistente_da_404(client_admin):
    assert client_admin.post('/facturas/9999/reintentar').status_code == 404


def test_reintentar_pendientes_devuelve_las_vencidas(session, factura_pendiente):
    ids = FacturacionService().reintentar_pendientes(session=session)

    assert ids == [factura_pendiente.id]


def test_calcular_montos_de_factura_c_no_discrimina_iva():
    neto, iva, total = FacturacionService.calcular_montos(Decimal('121000.00'), 11)

    assert (neto, iva, total) == (Decimal('121000.00'), Decimal('0.00'), Decimal('121000.00'))


def test_calcular_backoff_es_exponencial_y_acotado():
    assert FacturacionService.calcular_backoff(1) == settings.FACTURACION_BACKOFF_BASE_SEGUNDOS
    assert FacturacionService.calcular_backoff(2) == settings.FACTURACION_BACKOFF_BASE_SEGUNDOS * 2
    assert FacturacionService.calcular_backoff(50) == 3600


def test_calcular_montos_desglosado_agrupa_por_alicuota():
    """Items con alícuotas distintas: base e IVA por grupo, y sumas consistentes."""
    datos = FacturaCreate(
        pedido_id=1, numero_pedido='pedido-1', user_email='cliente@test.com',
        precio_total='210.00',
        detalles=[
            DetalleFacturaCreate(cantidad=1, precio_unitario='100.00', subtotal='100.00', alicuota_iva='10.50'),
            DetalleFacturaCreate(cantidad=2, precio_unitario='55.00', subtotal='110.00', alicuota_iva='21.00'),
        ],
    )

    neto, iva, total, desglose = FacturacionService.calcular_montos_desglosado(datos, 6)

    assert neto == Decimal('181.41')
    assert iva == Decimal('28.59')
    assert total == Decimal('210.00')
    assert neto + iva == total  # sin inconsistencia de importes (ARCA no rechaza por 10057)
    assert [(g['alicuota'], g['base_imponible'], g['importe']) for g in desglose] == [
        (Decimal('10.50'), Decimal('90.50'), Decimal('9.50')),
        (Decimal('21.00'), Decimal('90.91'), Decimal('19.09')),
    ]


def test_los_montos_float_son_rechazados_en_la_frontera():
    with pytest.raises(TypeError):
        FacturacionService.a_decimal(121000.5)


def test_payload_con_float_en_el_monto_rechazado_con_422(client_admin, payload_pedido, headers_internos):
    datos = payload_pedido(pedido_id=21)
    datos['precio_total'] = 121000.5

    assert client_admin.post('/facturas/', json=datos, headers=headers_internos).status_code == 422


def test_claim_es_atomico_solo_un_worker_gana(engine, factura_pendiente):
    service = FacturacionService(engine=engine)
    ahora = datetime.now(timezone.utc)
    corte = ahora - timedelta(seconds=settings.FACTURACION_TIMEOUT_PROCESANDO_SEGUNDOS)

    with Session(engine) as de_un_worker:
        gano_primero = service._reclamar_en(de_un_worker, factura_pendiente.id, ahora=ahora, corte=corte)
    with Session(engine) as de_otro_worker:
        gano_segundo = service._reclamar_en(de_otro_worker, factura_pendiente.id, ahora=ahora, corte=corte)

    assert gano_primero is True
    assert gano_segundo is False


def test_barrida_concurrente_no_duplica_trabajo(engine, factura_pendiente):
    """Dos instancias barren al mismo tiempo: cada factura la reclama un solo worker."""
    service = FacturacionService(engine=engine)

    with Session(engine) as primera_sesion:
        primeras = service.reintentar_pendientes(session=primera_sesion)
    with Session(engine) as segunda_sesion:
        segundas = service.reintentar_pendientes(session=segunda_sesion)

    assert primeras == [factura_pendiente.id]
    assert segundas == []


def test_pendiente_con_proximo_intento_futuro_no_entra_en_la_barrida(session, crear_factura):
    crear_factura(pedido_id=98, proximo_intento=datetime.now(timezone.utc) + timedelta(hours=1))

    assert FacturacionService().reintentar_pendientes(session=session) == []


def test_procesando_reciente_no_es_reclamado_por_otra_instancia(engine, crear_factura):
    """Un reclamo vivo (updated_at actual) no lo roba otro worker: sin doble emision."""
    crear_factura(pedido_id=96, estado=EstadoFactura.procesando)

    with Session(engine) as session:
        ids = FacturacionService(engine=engine).reclamar_procesando_vencidas(session)

    assert ids == []


def test_procesando_huerfano_por_timeout_se_recupera(engine, crear_factura):
    """Un contenedor murio con el claim abierto: otra instancia lo retoma por timeout."""
    crear_factura(
        pedido_id=97,
        estado=EstadoFactura.procesando,
        updated_at=datetime.now(timezone.utc) - timedelta(hours=1),
    )

    with Session(engine) as session:
        ids = FacturacionService(engine=engine).reclamar_procesando_vencidas(session)

    assert len(ids) == 1


def test_crash_post_arca_se_recupera_por_reconciliacion_sin_duplicar_comprobante(
    client_admin, arca_ya_autorizado, crear_factura,
):
    """ARCA autorizo el 3 pero el proceso murio antes de guardar: al recuperar la
    factura, la reconciliacion registra ESE CAE y no emite un segundo comprobante."""
    factura = crear_factura(pedido_id=42, numero_comprobante=3)

    client_admin.post(f'/facturas/{factura.id}/reintentar')

    detalle = client_admin.get(f'/facturas/{factura.id}').json()
    assert detalle['estado'] == EstadoFactura.aprobada.value
    assert detalle['cae'] == '88800000000000'
    # No re-emitio: conserva el numero 3 (una re-emision habria tomado el 1)
    assert detalle['numero_comprobante'] == 3


def test_carrera_de_correlativo_termina_emitendo_con_el_numero_fresco(
    client_admin, arca_carrera_de_numero, payload_pedido, headers_internos,
):
    respuesta = client_admin.post('/facturas/', json=payload_pedido(pedido_id=15), headers=headers_internos)

    detalle = client_admin.get(f"/facturas/{respuesta.json()['id']}").json()
    assert detalle['estado'] == EstadoFactura.aprobada.value
    # El 6 fue rechazado por carrera; al re-consultar el correlativo crecio (otra
    # instancia emitio) y la emision termino con el numero fresco 7.
    assert detalle['numero_comprobante'] == 7


def test_error_transitorio_agota_intentos_y_pasa_a_error(engine, arca_error_transitorio, crear_factura):
    """ARCA caida persistente: tras FACTURACION_MAX_INTENTOS la factura queda en
    `error` (tecnico) y sale de la barrida automatica (no retry storm infinito)."""
    factura = crear_factura(pedido_id=43)
    service = FacturacionService(engine=engine, cliente_factory=lambda: arca_error_transitorio)

    for _ in range(settings.FACTURACION_MAX_INTENTOS):
        service.emitir_cae(factura.id)
        # Simula el paso del tiempo: vence el backoff para que el proximo intento
        # vuelva a ser reclamable sin esperar el jitter real.
        with Session(engine) as session:
            agendada = session.get(Factura, factura.id)
            agendada.proximo_intento = None
            session.add(agendada)
            session.commit()

    with Session(engine) as session:
        actual = session.get(Factura, factura.id)
        assert actual.estado == EstadoFactura.error
        assert actual.intentos == settings.FACTURACION_MAX_INTENTOS
        assert 'timeout' in actual.ultimo_error

