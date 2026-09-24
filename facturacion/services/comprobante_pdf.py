"""Generacion del PDF fiscal del comprobante con el QR obligatorio de la RG 4290.

Se usa `reportlab` (wheels puros, sin dependencias de sistema: compatible con la imagen
`python:3.11-slim` del servicio) y su generador de QR incluido, para no sumar `qrcode`
ni `pillow`.

IMPORTANTE: aca si se usa `float()` sobre los importes, pero SOLO al armar el payload JSON
del QR (la especificacion de ARCA exige un numero JSON, no una cadena) y al imprimir. Los
calculos monetarios siguen siendo Decimal de punta a punta.
"""
import base64
import json
from datetime import date
from decimal import Decimal
from io import BytesIO

from reportlab.graphics.barcode import createBarcodeDrawing
from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.platypus import Image, Paragraph, SimpleDocTemplate, Spacer, Table, TableStyle

from config import settings
from models.factura import Factura, TipoComprobante, TipoDocumento

LETRAS_COMPROBANTE = {
    TipoComprobante.factura_a.value: 'A',
    TipoComprobante.factura_b.value: 'B',
    TipoComprobante.factura_c.value: 'C',
}

NOMBRES_DOCUMENTO = {
    TipoDocumento.cuit.value: 'CUIT',
    TipoDocumento.dni.value: 'DNI',
    TipoDocumento.sin_identificar.value: 'Sin identificar',
}

CENTAVOS = Decimal('0.01')


def _monto(valor) -> Decimal:
    """Decimal seguro para imprimir (los items guardados en JSON pueden venir como str)."""
    if valor is None:
        return Decimal('0.00')
    return Decimal(str(valor)).quantize(CENTAVOS)


def formatear_importe(valor) -> str:
    """Importe con separador de miles (formato es-AR) para el PDF."""
    numero = _monto(valor)
    entero, decimales = f'{numero:.2f}'.split('.')
    signo = '-' if entero.startswith('-') else ''
    entero = entero.lstrip('-')
    con_miles = ''
    while len(entero) > 3:
        con_miles = '.' + entero[-3:] + con_miles
        entero = entero[:-3]
    return f'{signo}$ {entero}{con_miles},{decimales}'


def letra_comprobante(tipo_comprobante: int) -> str:
    return LETRAS_COMPROBANTE.get(int(tipo_comprobante), '?')


def numero_comprobante_texto(factura: Factura) -> str:
    punto_venta = str(factura.punto_de_venta or 0).zfill(5)
    numero = str(factura.numero_comprobante or 0).zfill(8)
    return f'{punto_venta}-{numero}'


def nombre_archivo(factura: Factura) -> str:
    return f'Factura-{letra_comprobante(factura.tipo_comprobante)}-{numero_comprobante_texto(factura)}.pdf'


def construir_payload_qr(factura: Factura) -> dict:
    """Payload del QR de la RG 4290: identifica el comprobante ante ARCA."""
    fecha = factura.fecha_emision.date().isoformat() if factura.fecha_emision else date.today().isoformat()
    return {
        'ver': 1,
        'fecha': fecha,
        'cuit': int(settings.AFIP_CUIT),
        'ptoVta': int(factura.punto_de_venta),
        'tipoCmp': int(factura.tipo_comprobante),
        'nroCmp': int(factura.numero_comprobante or 0),
        'importe': float(factura.monto_total),  # numero JSON exigido por la especificacion
        'moneda': 'PES',
        'ctz': 1,
        'tipoDocRec': int(factura.doc_tipo),
        'nroDocRec': int(factura.doc_numero) if str(factura.doc_numero).isdigit() else 0,
        'tipoCodAut': 'E',
        'codAut': int(factura.cae or 0),
    }


def construir_url_qr(factura: Factura) -> str:
    """URL del QR: base de ARCA + `?p=<payload JSON en base64 url-safe>`."""
    crudo = json.dumps(construir_payload_qr(factura), separators=(',', ':')).encode('utf-8')
    codificado = base64.urlsafe_b64encode(crudo).decode('ascii')
    return f'{settings.AFIP_QR_URL_BASE.rstrip("/")}/?p={codificado}'


def _estilos() -> dict:
    base = getSampleStyleSheet()
    return {
        'titulo': ParagraphStyle('titulo', parent=base['Normal'], fontSize=14, leading=17, alignment=1, fontName='Helvetica-Bold'),
        'subtitulo': ParagraphStyle('subtitulo', parent=base['Normal'], fontSize=9, leading=12, alignment=1),
        'emisor': ParagraphStyle('emisor', parent=base['Normal'], fontSize=8.5, leading=11),
        'etiqueta': ParagraphStyle('etiqueta', parent=base['Normal'], fontSize=7.5, leading=10, textColor=colors.HexColor('#555555')),
        'dato': ParagraphStyle('dato', parent=base['Normal'], fontSize=9, leading=12, fontName='Helvetica-Bold'),
        'celda': ParagraphStyle('celda', parent=base['Normal'], fontSize=8, leading=10),
        'celdaDer': ParagraphStyle('celdaDer', parent=base['Normal'], fontSize=8, leading=10, alignment=2),
        'letra': ParagraphStyle('letra', parent=base['Normal'], fontSize=26, leading=28, alignment=1, fontName='Helvetica-Bold'),
        'legal': ParagraphStyle('legal', parent=base['Normal'], fontSize=7, leading=9, textColor=colors.HexColor('#666666')),
    }


def _bloque_encabezado(factura: Factura, estilos: dict) -> Table:
    """Emisor + letra del comprobante + tipo/numero/fecha (formato de factura argentina)."""
    emisor = [
        Paragraph(f'<b>{settings.AFIP_RAZON_SOCIAL_EMISOR or "Emisor no configurado"}</b>', estilos['emisor']),
        Paragraph(f'CUIT: {settings.AFIP_CUIT}', estilos['emisor']),
        Paragraph(f'Domicilio: {settings.AFIP_DOMICILIO_EMISOR or "-"}', estilos['emisor']),
        Paragraph(f'Ingresos brutos: {settings.AFIP_INGRESOS_BRUTOS or "-"}', estilos['emisor']),
        Paragraph(f'Inicio de actividades: {settings.AFIP_INICIO_ACTIVIDADES or "-"}', estilos['emisor']),
    ]

    letra = Table(
        [[Paragraph(letra_comprobante(factura.tipo_comprobante), estilos['letra'])],
         [Paragraph(f'COD. {str(factura.tipo_comprobante).zfill(2)}', estilos['subtitulo'])]],
        colWidths=[18 * mm],
    )
    letra.setStyle(TableStyle([
        ('BOX', (0, 0), (-1, -1), 1, colors.black),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
    ]))

    fecha = factura.fecha_emision.strftime('%d/%m/%Y') if factura.fecha_emision else '-'
    cabecera = [
        Paragraph('FACTURA', estilos['titulo']),
        Paragraph(f'N° {numero_comprobante_texto(factura)}', estilos['subtitulo']),
        Spacer(1, 2 * mm),
        Paragraph(f'Fecha de emisión: {fecha}', estilos['subtitulo']),
    ]

    tabla = Table([[emisor, letra, cabecera]], colWidths=[95 * mm, 22 * mm, 58 * mm])
    tabla.setStyle(TableStyle([
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('BOX', (0, 0), (-1, -1), 0.75, colors.HexColor('#cccccc')),
        ('INNERGRID', (0, 0), (-1, -1), 0.4, colors.HexColor('#e5e5e5')),
        ('LEFTPADDING', (0, 0), (-1, -1), 6),
        ('RIGHTPADDING', (0, 0), (-1, -1), 6),
        ('TOPPADDING', (0, 0), (-1, -1), 5),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 5),
    ]))
    return tabla


def _bloque_receptor(factura: Factura, estilos: dict) -> Table:
    """Datos del receptor del comprobante (los que viajaron en el snapshot contable)."""
    tipo_doc = NOMBRES_DOCUMENTO.get(int(factura.doc_tipo), str(factura.doc_tipo))
    izquierda = [
        Paragraph('RECEPTOR', estilos['etiqueta']),
        Paragraph(factura.razon_social or 'Consumidor Final', estilos['dato']),
    ]
    centro = [
        Paragraph('DOCUMENTO', estilos['etiqueta']),
        Paragraph(f'{tipo_doc}: {factura.doc_numero}', estilos['dato']),
    ]
    derecha = [
        Paragraph('PEDIDO', estilos['etiqueta']),
        Paragraph(factura.numero_pedido or f'#{factura.pedido_id}', estilos['dato']),
    ]

    tabla = Table([[izquierda, centro, derecha]], colWidths=[95 * mm, 45 * mm, 35 * mm])
    tabla.setStyle(TableStyle([
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('BOX', (0, 0), (-1, -1), 0.75, colors.HexColor('#cccccc')),
        ('INNERGRID', (0, 0), (-1, -1), 0.4, colors.HexColor('#e5e5e5')),
        ('LEFTPADDING', (0, 0), (-1, -1), 6),
        ('TOPPADDING', (0, 0), (-1, -1), 5),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 5),
    ]))
    return tabla


def _tabla_items(factura: Factura, estilos: dict) -> Table:
    """Detalle del pedido: es el snapshot contable guardado con la factura."""
    filas = [[
        Paragraph('<b>Descripción</b>', estilos['celda']),
        Paragraph('<b>Cant.</b>', estilos['celdaDer']),
        Paragraph('<b>P. unitario</b>', estilos['celdaDer']),
        Paragraph('<b>Subtotal</b>', estilos['celdaDer']),
    ]]

    for detalle in (factura.detalles or []):
        filas.append([
            Paragraph(str(detalle.get('descripcion') or 'Producto'), estilos['celda']),
            Paragraph(str(detalle.get('cantidad') or 0), estilos['celdaDer']),
            Paragraph(formatear_importe(detalle.get('precio_unitario')), estilos['celdaDer']),
            Paragraph(formatear_importe(detalle.get('subtotal')), estilos['celdaDer']),
        ])

    if len(filas) == 1:
        filas.append([Paragraph('Sin detalle de items registrado', estilos['celda']), '', '', ''])

    tabla = Table(filas, colWidths=[95 * mm, 20 * mm, 30 * mm, 30 * mm], repeatRows=1)
    tabla.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#f2f2f2')),
        ('BOX', (0, 0), (-1, -1), 0.5, colors.HexColor('#cccccc')),
        ('INNERGRID', (0, 0), (-1, -1), 0.3, colors.HexColor('#e5e5e5')),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('LEFTPADDING', (0, 0), (-1, -1), 5),
        ('RIGHTPADDING', (0, 0), (-1, -1), 5),
        ('TOPPADDING', (0, 0), (-1, -1), 3),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 3),
    ]))
    return tabla


def _tabla_totales(factura: Factura, estilos: dict) -> Table:
    """Importes: desglose de IVA por alicuota, neto, IVA y total."""
    filas = [[
        Paragraph('<b>Alícuota IVA</b>', estilos['celda']),
        Paragraph('<b>Base imponible</b>', estilos['celdaDer']),
        Paragraph('<b>IVA</b>', estilos['celdaDer']),
    ]]

    desglose = factura.desglose_iva or []
    if desglose:
        for item in desglose:
            alicuota = _monto(item.get('alicuota'))
            filas.append([
                Paragraph(f'{alicuota:.2f}%', estilos['celda']),
                Paragraph(formatear_importe(item.get('base_imponible')), estilos['celdaDer']),
                Paragraph(formatear_importe(item.get('importe')), estilos['celdaDer']),
            ])
    else:
        filas.append([
            Paragraph('IVA', estilos['celda']),
            Paragraph(formatear_importe(factura.monto_neto), estilos['celdaDer']),
            Paragraph(formatear_importe(factura.monto_iva), estilos['celdaDer']),
        ])

    filas.append([Paragraph('<b>Neto</b>', estilos['celda']), '',
                  Paragraph(f'<b>{formatear_importe(factura.monto_neto)}</b>', estilos['celdaDer'])])
    filas.append([Paragraph('<b>IVA</b>', estilos['celda']), '',
                  Paragraph(f'<b>{formatear_importe(factura.monto_iva)}</b>', estilos['celdaDer'])])
    filas.append([Paragraph('<b>TOTAL</b>', estilos['celda']), '',
                  Paragraph(f'<b>{formatear_importe(factura.monto_total)}</b>', estilos['celdaDer'])])

    tabla = Table(filas, colWidths=[35 * mm, 45 * mm, 35 * mm], hAlign='RIGHT')
    tabla.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#f2f2f2')),
        ('BOX', (0, 0), (-1, -1), 0.5, colors.HexColor('#cccccc')),
        ('INNERGRID', (0, 0), (-1, -1), 0.3, colors.HexColor('#e5e5e5')),
        ('SPAN', (0, -3), (1, -3)),
        ('SPAN', (0, -2), (1, -2)),
        ('SPAN', (0, -1), (1, -1)),
        ('BACKGROUND', (0, -1), (-1, -1), colors.HexColor('#eaeaea')),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('LEFTPADDING', (0, 0), (-1, -1), 5),
        ('RIGHTPADDING', (0, 0), (-1, -1), 5),
        ('TOPPADDING', (0, 0), (-1, -1), 3),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 3),
    ]))
    return tabla


def _bloque_autorizacion(factura: Factura, estilos: dict) -> Table:
    """QR de la RG 4290 + CAE y su vencimiento."""
    qr = createBarcodeDrawing('QR', value=construir_url_qr(factura), width=32 * mm, height=32 * mm)
    vencimiento = factura.vencimiento_cae.strftime('%d/%m/%Y') if factura.vencimiento_cae else '-'
    datos = [
        Paragraph('AUTORIZACIÓN ARCA', estilos['etiqueta']),
        Paragraph(f'CAE N°: {factura.cae}', estilos['dato']),
        Paragraph(f'Vencimiento CAE: {vencimiento}', estilos['dato']),
        Spacer(1, 1 * mm),
        Paragraph('Comprobante autorizado según RG 4290. Escaneá el QR para verificarlo en el sitio de ARCA.', estilos['legal']),
    ]

    tabla = Table([[qr, datos]], colWidths=[36 * mm, 109 * mm])
    tabla.setStyle(TableStyle([
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('BOX', (0, 0), (-1, -1), 0.5, colors.HexColor('#cccccc')),
        ('LEFTPADDING', (0, 0), (-1, -1), 6),
        ('TOPPADDING', (0, 0), (-1, -1), 6),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
    ]))
    return tabla


def generar_pdf_comprobante(factura: Factura) -> bytes:
    """Devuelve el PDF del comprobante autorizado, listo para descargar."""
    estilos = _estilos()
    buffer = BytesIO()

    documento = SimpleDocTemplate(
        buffer,
        pagesize=A4,
        leftMargin=15 * mm,
        rightMargin=15 * mm,
        topMargin=15 * mm,
        bottomMargin=15 * mm,
        title=f'Factura {letra_comprobante(factura.tipo_comprobante)} {numero_comprobante_texto(factura)}',
        author=settings.AFIP_RAZON_SOCIAL_EMISOR or 'Microservicio de facturacion',
    )

    contenido = [
        _bloque_encabezado(factura, estilos),
        Spacer(1, 4 * mm),
        _bloque_receptor(factura, estilos),
        Spacer(1, 4 * mm),
        _tabla_items(factura, estilos),
        Spacer(1, 4 * mm),
        _tabla_totales(factura, estilos),
        Spacer(1, 5 * mm),
        _bloque_autorizacion(factura, estilos),
    ]

    documento.build(contenido)
    return buffer.getvalue()

