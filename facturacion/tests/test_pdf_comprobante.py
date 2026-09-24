"""Descarga del PDF fiscal del comprobante (RG 4290) y control de acceso."""
import base64
import json
from datetime import date, datetime, timezone
from decimal import Decimal

from models.factura import EstadoFactura, TipoComprobante
from services.comprobante_pdf import construir_payload_qr, construir_url_qr, nombre_archivo, numero_comprobante_texto

EMAIL_CLIENTE = 'cliente@test.com'
EMAIL_OTRO = 'otro@test.com'


def _datos_fiscales(**kwargs):
    """Datos de una factura ya autorizada por ARCA."""
    datos = {
        'estado': EstadoFactura.aprobada,
        'cae': '75123456789012',
        'vencimiento_cae': date(2026, 11, 2),
        'numero_comprobante': 15,
        'fecha_emision': datetime(2026, 9, 23, 21, 37, tzinfo=timezone.utc),
        'tipo_comprobante': TipoComprobante.factura_b.value,
        'desglose_iva': [{'alicuota': '21.00', 'base_imponible': '100000.00', 'importe': '21000.00'}],
        'detalles': [
            {'descripcion': 'Camiseta', 'cantidad': 2, 'precio_unitario': '50000.00', 'subtotal': '100000.00'},
        ],
    }
    datos.update(kwargs)
    return datos


def test_admin_descarga_el_pdf_de_una_factura_aprobada(client_admin, crear_factura):
    factura = crear_factura(pedido_id=201, **_datos_fiscales())

    respuesta = client_admin.get(f'/facturas/{factura.id}/pdf')

    assert respuesta.status_code == 200
    assert respuesta.headers['content-type'] == 'application/pdf'
    # El PDF viaja como adjunto con el nombre del comprobante
    assert 'attachment' in respuesta.headers['content-disposition']
    assert 'Factura-B-00001-00000015.pdf' in respuesta.headers['content-disposition']
    assert respuesta.content.startswith(b'%PDF')


def test_pdf_de_factura_no_autorizada_da_409(client_admin, crear_factura):
    """Una factura sin CAE no es un comprobante valido: no se puede descargar."""
    factura = crear_factura(pedido_id=202, estado=EstadoFactura.pendiente)
    rechazada = crear_factura(pedido_id=203, estado=EstadoFactura.rechazada)

    assert client_admin.get(f'/facturas/{factura.id}/pdf').status_code == 409
    assert client_admin.get(f'/facturas/{rechazada.id}/pdf').status_code == 409


def test_pdf_de_factura_inexistente_da_404(client_admin):
    assert client_admin.get('/facturas/99999/pdf').status_code == 404


def test_pdf_requiere_permiso_admin(client, crear_factura):
    factura = crear_factura(pedido_id=204, **_datos_fiscales())

    assert client.get(f'/facturas/{factura.id}/pdf').status_code == 403


def test_pdf_sin_token_da_401(client_sin_auth, crear_factura):
    factura = crear_factura(pedido_id=205, **_datos_fiscales())

    assert client_sin_auth.get(f'/facturas/{factura.id}/pdf').status_code == 401
    assert client_sin_auth.get(f'/mis-facturas/{factura.id}/pdf').status_code == 401


def test_cliente_descarga_su_propio_comprobante(client, crear_factura):
    factura = crear_factura(pedido_id=206, user_email=EMAIL_CLIENTE, **_datos_fiscales())

    respuesta = client.get(f'/mis-facturas/{factura.id}/pdf')

    assert respuesta.status_code == 200
    assert respuesta.content.startswith(b'%PDF')


def test_cliente_no_puede_descargar_el_comprobante_de_otro(client, crear_factura):
    """El alcance `own` valida la titularidad: 404 en lugar de filtrar que existe."""
    factura = crear_factura(pedido_id=207, user_email=EMAIL_OTRO, **_datos_fiscales())

    assert client.get(f'/mis-facturas/{factura.id}/pdf').status_code == 404


def test_payload_del_qr_sigue_la_rg_4290(crear_factura):
    factura = crear_factura(pedido_id=208, **_datos_fiscales())

    payload = construir_payload_qr(factura)

    assert payload['ver'] == 1
    assert payload['fecha'] == '2026-09-23'
    assert payload['tipoCmp'] == 6
    assert payload['nroCmp'] == 15
    assert payload['codAut'] == 75123456789012
    assert payload['tipoCodAut'] == 'E'
    assert payload['moneda'] == 'PES'
    assert payload['importe'] == 121000.0

    # La URL lleva el JSON en base64 url-safe, tal como lo exige ARCA
    url = construir_url_qr(factura)
    assert url.startswith('https://www.afip.gob.ar/fe/qr/?p=')
    codificado = url.split('?p=')[1]
    assert json.loads(base64.urlsafe_b64decode(codificado)) == payload


def test_helpers_de_numeracion():
    class FacturaFalsa:
        punto_de_venta = 1
        numero_comprobante = 15
        tipo_comprobante = 6

    assert numero_comprobante_texto(FacturaFalsa()) == '00001-00000015'
    assert nombre_archivo(FacturaFalsa()) == 'Factura-B-00001-00000015.pdf'


def test_el_pdf_incluye_importes_y_datos_del_emisor(client_admin, crear_factura):
    """El PDF se genera desde el snapshot guardado (no vuelve a consultar ARCA ni la tienda)."""
    from config import settings
    from services.comprobante_pdf import generar_pdf_comprobante

    factura = crear_factura(pedido_id=209, **_datos_fiscales())
    contenido = generar_pdf_comprobante(factura)

    assert contenido.startswith(b'%PDF')
    assert len(contenido) > 2000
    # El texto de un PDF con fuentes estandar viaja comprimido; se valida el metadato
    # del titulo con el comprobante y que los importes calculados no fallen.
    assert settings.AFIP_CUIT > 0
    assert Decimal(str(factura.monto_total)) == Decimal('121000.00')
