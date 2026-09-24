// Helpers compartidos por la vista de cliente (/mis-facturas) y el panel admin (/admin/facturas).
// Los estados son los del microservicio de facturacion: pendiente | procesando | aprobada | rechazada | error.

export const ESTADOS_FACTURA = ['pendiente', 'procesando', 'aprobada', 'rechazada', 'error'];

export const ETIQUETAS_ESTADO_FACTURA = {
    pendiente: 'Pendiente',
    procesando: 'Procesando',
    aprobada: 'Aprobada',
    rechazada: 'Rechazada',
    error: 'Error técnico',
};

export const COLORES_ESTADO_FACTURA = {
    pendiente: '#f59e0b',
    procesando: '#2563eb',
    aprobada: '#16a34a',
    rechazada: '#dc2626',
    error: '#6b7280',
};

// Codigos de tipo de comprobante de ARCA (WSFE)
const TIPOS_COMPROBANTE = {
    1: 'Factura A',
    6: 'Factura B',
    11: 'Factura C',
};

// Codigos de tipo de documento del receptor
const TIPOS_DOCUMENTO = {
    80: 'CUIT',
    96: 'DNI',
    99: 'Sin identificar',
};

export const etiquetaEstadoFactura = (estado) => ETIQUETAS_ESTADO_FACTURA[estado] || estado || '-';

export const etiquetaTipoComprobante = (tipo) => TIPOS_COMPROBANTE[tipo] || `Comprobante ${tipo}`;

export const etiquetaTipoDocumento = (tipo) => TIPOS_DOCUMENTO[tipo] || `${tipo}`;

export const formatearMoneda = (monto) => {
    const numero = Number(monto);
    if (Number.isNaN(numero)) return '-';
    return `$${numero.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

/**
 * Normaliza un timestamp del microservicio.
 *
 * Las columnas son `DateTime` SIN timezone: el backend guarda UTC pero en el JSON
 * viaja sin offset ("2026-09-23T21:37:08.327449"). Si se lo pasa crudo a `new Date()`,
 * JS lo interpreta como hora LOCAL (3 h de corrimiento en Argentina y hasta un dia de
 * diferencia). Por eso se le agrega la 'Z' cuando no trae zona explicita.
 */
const normalizarFecha = (valor) => {
    if (!valor) return null;
    const texto = String(valor);
    const tieneZona = /(?:Z|[+-]\d{2}:?\d{2})$/.test(texto);
    const fecha = new Date(tieneZona ? texto : `${texto}Z`);
    return Number.isNaN(fecha.getTime()) ? null : fecha;
};

// Fecha en UTC-naive (created_at, fecha_emision, proximo_intento)
export const formatearFechaFactura = (valor) => {
    const fecha = normalizarFecha(valor);
    if (!fecha) return '-';
    return fecha.toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric' });
};

export const formatearFechaHoraFactura = (valor) => {
    const fecha = normalizarFecha(valor);
    if (!fecha) return '-';
    return fecha.toLocaleString('es-AR');
};

// Una factura esta autorizada fiscalmente solo si tiene CAE
export const estaAprobada = (factura) => factura?.estado === 'aprobada' && Boolean(factura?.cae);

// Se puede reintentar mientras no este autorizada ni en curso por otro worker
export const esReintentable = (factura) => ['pendiente', 'rechazada', 'error'].includes(factura?.estado);

// Numero de comprobante con el formato de ARCA: punto de venta + correlativo
export const numeroComprobanteTexto = (factura) => {
    if (factura?.numero_comprobante == null) return '-';
    const puntoVenta = String(factura.punto_de_venta ?? 0).padStart(5, '0');
    const numero = String(factura.numero_comprobante).padStart(8, '0');
    return `${puntoVenta}-${numero}`;
};

const escaparHtml = (valor) => String(valor ?? '').replace(/[&<>"']/g, (caracter) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
}[caracter]));

/**
 * Descarga el comprobante como un archivo HTML imprimible (sin dependencias).
 *
 * Se arma en el cliente con los datos que ya devuelve la API; para un PDF fiscal
 * formal (con QR de la RG 4290) hace falta un endpoint de PDF en el microservicio.
 */
export const descargarComprobante = (factura) => {
    if (!estaAprobada(factura)) return false;

    const filasDesglose = (factura.desglose_iva || [])
        .map((item) => `<tr><td>${escaparHtml(item.alicuota)}%</td><td>${formatearMoneda(item.base_imponible)}</td><td>${formatearMoneda(item.importe)}</td></tr>`)
        .join('');

    const contenido = `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="utf-8" />
<title>${etiquetaTipoComprobante(factura.tipo_comprobante)} ${numeroComprobanteTexto(factura)}</title>
<style>
  body { font-family: system-ui, Arial, sans-serif; margin: 2rem; color: #1f2937; }
  h1 { font-size: 1.3rem; margin-bottom: 0.25rem; }
  h2 { font-size: 1rem; margin: 1.5rem 0 0.5rem; }
  table { width: 100%; border-collapse: collapse; margin-top: 0.5rem; }
  th, td { border: 1px solid #d1d5db; padding: 0.45rem 0.6rem; text-align: left; font-size: 0.9rem; }
  th { background: #f3f4f6; }
  .dato { display: flex; justify-content: space-between; border-bottom: 1px solid #e5e7eb; padding: 0.35rem 0; font-size: 0.9rem; }
  .total { font-size: 1.05rem; font-weight: 700; }
</style>
</head>
<body>
  <h1>${etiquetaTipoComprobante(factura.tipo_comprobante)}</h1>
  <p>N° ${numeroComprobanteTexto(factura)} &mdash; Punto de venta ${escaparHtml(factura.punto_de_venta)}</p>

  <h2>Receptor</h2>
  <div class="dato"><span>Razón social</span><strong>${escaparHtml(factura.razon_social)}</strong></div>
  <div class="dato"><span>${etiquetaTipoDocumento(factura.doc_tipo)}</span><strong>${escaparHtml(factura.doc_numero)}</strong></div>

  <h2>Fecha</h2>
  <div class="dato"><span>Fecha de emisión</span><strong>${escaparHtml(formatearFechaHoraFactura(factura.fecha_emision))}</strong></div>

  <h2>Importes</h2>
  ${filasDesglose ? `<table><thead><tr><th>Alícuota IVA</th><th>Base imponible</th><th>IVA</th></tr></thead><tbody>${filasDesglose}</tbody></table>` : ''}
  <div class="dato"><span>Neto</span><strong>${formatearMoneda(factura.monto_neto)}</strong></div>
  <div class="dato"><span>IVA</span><strong>${formatearMoneda(factura.monto_iva)}</strong></div>
  <div class="dato total"><span>Total</span><strong>${formatearMoneda(factura.monto_total)}</strong></div>

  <h2>Autorización ARCA</h2>
  <div class="dato"><span>CAE</span><strong>${escaparHtml(factura.cae)}</strong></div>
  <div class="dato"><span>Vencimiento CAE</span><strong>${escaparHtml(factura.vencimiento_cae)}</strong></div>

  <p style="margin-top:2rem;font-size:0.8rem;color:#6b7280;">
    Pedido ${escaparHtml(factura.numero_pedido)} &mdash; comprobante generado por el microservicio de facturación.
  </p>
</body>
</html>`;

    const archivo = new Blob([contenido], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(archivo);
    const enlace = document.createElement('a');
    enlace.href = url;
    enlace.download = `${etiquetaTipoComprobante(factura.tipo_comprobante).replace(/\s+/g, '-')}-${numeroComprobanteTexto(factura)}.html`;
    document.body.appendChild(enlace);
    enlace.click();
    document.body.removeChild(enlace);
    URL.revokeObjectURL(url);
    return true;
};
