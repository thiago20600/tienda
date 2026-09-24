import {
    AccionesFila,
    Celda,
    EncabezadoTabla,
    ErrorFactura,
    FilaFactura,
    MensajeTabla,
    TablaFacturas,
} from './FacturasTabla.styles';
import AdminButton from '../ui/AdminButton/AdminButton';
import EstadoFacturaBadge from '../../facturas/EstadoFacturaBadge';
import {
    esReintentable,
    etiquetaTipoComprobante,
    formatearFechaFactura,
    formatearMoneda,
    numeroComprobanteTexto,
} from '../../../utils/facturas';

// Tabla del panel de facturacion: permite ver el detalle, ver el error exacto y reintentar.
const FacturasTabla = ({ facturas, cargando, statusError, onVerDetalle, onReintentar, reintentandoId }) => {
    if (cargando) return <MensajeTabla>Cargando facturas...</MensajeTabla>;
    if (statusError === 403) return <MensajeTabla>No tenés permiso para ver las facturas (facturas:read:admin).</MensajeTabla>;
    if (statusError) return <MensajeTabla>Error al cargar facturas (Código: {statusError})</MensajeTabla>;
    if (facturas.length === 0) return <MensajeTabla>No hay facturas que coincidan con los filtros.</MensajeTabla>;

    return (
        <TablaFacturas>
            <EncabezadoTabla>
                <span>Fecha</span>
                <span>Nº de pedido</span>
                <span>Cliente</span>
                <span>Tipo</span>
                <span>Comprobante</span>
                <span>Total</span>
                <span>Estado / Acciones</span>
            </EncabezadoTabla>
            <ul>
                {facturas.map((factura) => (
                    <li key={factura.id}>
                        <FilaFactura>
                            <Celda>{formatearFechaFactura(factura.created_at)}</Celda>
                            <Celda>{factura.numero_pedido || `#${factura.pedido_id}`}</Celda>
                            <Celda title={factura.user_email}>{factura.user_email}</Celda>
                            <Celda>{etiquetaTipoComprobante(factura.tipo_comprobante)}</Celda>
                            <Celda>{numeroComprobanteTexto(factura)}</Celda>
                            <Celda $monto>{formatearMoneda(factura.monto_total)}</Celda>
                            <AccionesFila>
                                <EstadoFacturaBadge estado={factura.estado} />
                                <AdminButton type="button" $variant="secondary" $size="sm" onClick={() => onVerDetalle(factura)}>
                                    Detalle
                                </AdminButton>
                                {esReintentable(factura) && (
                                    <AdminButton
                                        type="button"
                                        $variant="ghost"
                                        $size="sm"
                                        onClick={() => onReintentar(factura)}
                                        disabled={reintentandoId === factura.id}
                                    >
                                        {reintentandoId === factura.id ? 'Reintentando...' : 'Reintentar'}
                                    </AdminButton>
                                )}
                            </AccionesFila>
                        </FilaFactura>
                        {(factura.estado === 'rechazada' || factura.estado === 'error') && factura.ultimo_error && (
                            <ErrorFactura title={factura.ultimo_error}>
                                {factura.intentos} intento(s) · {factura.ultimo_error}
                            </ErrorFactura>
                        )}
                    </li>
                ))}
            </ul>
        </TablaFacturas>
    );
};

export default FacturasTabla;
