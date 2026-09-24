import { useEffect, useState } from 'react';
import {
    AccionesModal,
    CerrarBoton,
    Dato,
    EncabezadoModal,
    MensajeError,
    MensajeInfo,
    Modal,
    Overlay,
    Seccion,
    TablaIva,
} from './DetalleFactura.styles';
import EstadoFacturaBadge from './EstadoFacturaBadge';
import {
    descargarComprobante,
    estaAprobada,
    esReintentable,
    etiquetaTipoComprobante,
    etiquetaTipoDocumento,
    formatearFechaHoraFactura,
    formatearMoneda,
    numeroComprobanteTexto,
} from '../../utils/facturas';

/**
 * Detalle fiscal de una factura. Se usa como modal en la vista de cliente y en el panel admin.
 *
 * `onReintentar` solo lo pasa el panel admin: si llega, se muestra el boton de reintento.
 */
const DetalleFactura = ({ factura, onCerrar, onReintentar, reintentando = false, mostrarCliente = true }) => {
    const [mensaje, setMensaje] = useState(null);

    useEffect(() => {
        const cerrarConEscape = (event) => {
            if (event.key === 'Escape') onCerrar();
        };
        window.addEventListener('keydown', cerrarConEscape);
        return () => window.removeEventListener('keydown', cerrarConEscape);
    }, [onCerrar]);

    if (!factura) return null;

    const aprobada = estaAprobada(factura);
    const puedeReintentar = Boolean(onReintentar) && esReintentable(factura);

    const handleReintentar = async () => {
        setMensaje(null);
        const resultado = await onReintentar(factura);
        if (resultado?.ok) {
            setMensaje({ texto: 'Reintento encolado: la factura se va a emitir en segundo plano.' });
        } else {
            setMensaje({ error: resultado?.detalle || `No se pudo reintentar la factura (código: ${resultado?.status}).` });
        }
    };

    const handleDescargar = () => {
        const descargado = descargarComprobante(factura);
        if (!descargado) {
            setMensaje({ error: 'La factura todavía no está autorizada por ARCA: no hay comprobante para descargar.' });
        }
    };

    return (
        <Overlay onClick={(event) => { if (event.target === event.currentTarget) onCerrar(); }}>
            <Modal role="dialog" aria-modal="true" aria-label="Detalle de factura">
                <EncabezadoModal>
                    <div>
                        <h2>{etiquetaTipoComprobante(factura.tipo_comprobante)}</h2>
                        <p>N° {numeroComprobanteTexto(factura)} · Punto de venta {factura.punto_de_venta}</p>
                    </div>
                    <div>
                        <EstadoFacturaBadge estado={factura.estado} />
                        <CerrarBoton type="button" onClick={onCerrar} aria-label="Cerrar detalle">✕</CerrarBoton>
                    </div>
                </EncabezadoModal>
                <Seccion>
                    <h3>Pedido</h3>
                    <Dato><span>Número de pedido</span><strong>{factura.numero_pedido || `#${factura.pedido_id}`}</strong></Dato>
                    {mostrarCliente && <Dato><span>Cliente</span><strong>{factura.user_email}</strong></Dato>}
                    <Dato><span>Receptor</span><strong>{factura.razon_social}</strong></Dato>
                    <Dato><span>{etiquetaTipoDocumento(factura.doc_tipo)}</span><strong>{factura.doc_numero}</strong></Dato>
                </Seccion>

                <Seccion>
                    <h3>Importes</h3>
                    {factura.desglose_iva?.length > 0 && (
                        <TablaIva>
                            <thead>
                                <tr><th>Alícuota IVA</th><th>Base imponible</th><th>IVA</th></tr>
                            </thead>
                            <tbody>
                                {factura.desglose_iva.map((item, indice) => (
                                    <tr key={`${item.alicuota}-${indice}`}>
                                        <td>{Number(item.alicuota).toLocaleString('es-AR')}%</td>
                                        <td>{formatearMoneda(item.base_imponible)}</td>
                                        <td>{formatearMoneda(item.importe)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </TablaIva>
                    )}
                    <Dato><span>Neto</span><strong>{formatearMoneda(factura.monto_neto)}</strong></Dato>
                    <Dato><span>IVA</span><strong>{formatearMoneda(factura.monto_iva)}</strong></Dato>
                    <Dato $total><span>Total</span><strong>{formatearMoneda(factura.monto_total)}</strong></Dato>
                </Seccion>

                <Seccion>
                    <h3>Autorización ARCA</h3>
                    <Dato><span>CAE</span><strong>{factura.cae || 'Pendiente de autorización'}</strong></Dato>
                    <Dato><span>Vencimiento CAE</span><strong>{factura.vencimiento_cae || '-'}</strong></Dato>
                    <Dato><span>Emisión fiscal</span><strong>{formatearFechaHoraFactura(factura.fecha_emision)}</strong></Dato>
                    <Dato><span>Registrada el</span><strong>{formatearFechaHoraFactura(factura.created_at)}</strong></Dato>
                </Seccion>

                {!aprobada && (
                    <Seccion>
                        <h3>Seguimiento</h3>
                        <Dato><span>Intentos de emisión</span><strong>{factura.intentos}</strong></Dato>
                        {factura.proximo_intento && <Dato><span>Próximo intento</span><strong>{formatearFechaHoraFactura(factura.proximo_intento)}</strong></Dato>}
                        {factura.ultimo_error && <MensajeError>{factura.ultimo_error}</MensajeError>}
                    </Seccion>
                )}

                {aprobada && (
                    <MensajeInfo>
                        Comprobante autorizado por ARCA. Los datos fiscales quedan congelados: no se pueden modificar.
                    </MensajeInfo>
                )}

                {mensaje?.error && <MensajeError>{mensaje.error}</MensajeError>}
                {mensaje?.texto && <MensajeInfo>{mensaje.texto}</MensajeInfo>}

                <AccionesModal>
                    {aprobada && (
                        <button type="button" className="descargar" onClick={handleDescargar}>Descargar comprobante</button>
                    )}
                    {puedeReintentar && (
                        <button type="button" className="reintentar" onClick={handleReintentar} disabled={reintentando}>
                            {reintentando ? 'Reintentando...' : 'Reintentar emisión'}
                        </button>
                    )}
                    <button type="button" className="cerrar" onClick={onCerrar}>Cerrar</button>
                </AccionesModal>
            </Modal>
        </Overlay>
    );
};

export default DetalleFactura;
