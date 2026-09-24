import { useState } from 'react'
import {
    AccionesTarjeta,
    BotonDescargar,
    BotonDetalle,
    DatosFiscales,
    EncabezadoFactura,
    MensajeAviso,
    MensajeError,
    MensajeVacio,
    MisFacturasContainer,
    PrecioTotal,
    Subtitulo,
    TarjetaFactura,
    Titulo,
} from './MisFacturas.styles'
import CambiarPagina from '../../componentes/adminpanel/tablas/CambiarPagina/CambiarPagina.jsx'
import EstadoFacturaBadge from '../../componentes/facturas/EstadoFacturaBadge'
import DetalleFactura from '../../componentes/facturas/DetalleFactura'
import useMisFacturas from '../../hooks/facturas/useMisFacturas.jsx'
import {
    descargarComprobante,
    estaAprobada,
    etiquetaTipoComprobante,
    formatearFechaFactura,
    formatearMoneda,
    numeroComprobanteTexto,
} from '../../utils/facturas'

// Vista del cliente: sus comprobantes, detalle fiscal (CAE + vencimiento) y descarga.
const MisFacturas = () => {
    const { facturas, cargando, statusError, page, pages, cambiarPagina } = useMisFacturas({ size: 5 })
    const [seleccionada, setSeleccionada] = useState(null)

    if (cargando) return <MisFacturasContainer><p>Cargando tus facturas...</p></MisFacturasContainer>

    if (statusError === 403) {
        return (
            <MisFacturasContainer>
                <Titulo>Mis facturas</Titulo>
                <MensajeAviso>
                    Tu usuario todavía no tiene el permiso <strong>facturas:read:own</strong>.
                    Pedile a un administrador que te lo asigne para ver tus comprobantes.
                </MensajeAviso>
            </MisFacturasContainer>
        )
    }

    if (statusError) {
        return (
            <MisFacturasContainer>
                <Titulo>Mis facturas</Titulo>
                <MensajeError>No se pudieron cargar tus facturas (código: {statusError}).</MensajeError>
            </MisFacturasContainer>
        )
    }

    return (
        <MisFacturasContainer>
            <Titulo>Mis facturas</Titulo>
            <Subtitulo>Comprobantes emitidos a tu nombre. Podés ver el CAE y descargar los aprobados.</Subtitulo>

            {facturas.length === 0 && (
                <MensajeVacio>Todavía no tenés facturas emitidas.</MensajeVacio>
            )}

            {facturas.map((factura) => {
                const aprobada = estaAprobada(factura)
                return (
                    <TarjetaFactura key={factura.id}>
                        <EncabezadoFactura>
                            <div>
                                <strong>{factura.numero_pedido || `Pedido #${factura.pedido_id}`}</strong>
                                <span>{formatearFechaFactura(factura.created_at)}</span>
                            </div>
                            <EstadoFacturaBadge estado={factura.estado} />
                        </EncabezadoFactura>

                        <DatosFiscales>
                            <div>
                                <dt>Tipo de comprobante</dt>
                                <dd>{etiquetaTipoComprobante(factura.tipo_comprobante)}</dd>
                            </div>
                            <div>
                                <dt>Nº de comprobante</dt>
                                <dd>{numeroComprobanteTexto(factura)}</dd>
                            </div>
                            <div>
                                <dt>CAE</dt>
                                <dd>{factura.cae || 'Pendiente de autorización'}</dd>
                            </div>
                            <div>
                                <dt>Vencimiento CAE</dt>
                                <dd>{factura.vencimiento_cae || '-'}</dd>
                            </div>
                        </DatosFiscales>

                        <footer>
                            <PrecioTotal>Total: {formatearMoneda(factura.monto_total)}</PrecioTotal>
                            <AccionesTarjeta>
                                <BotonDetalle type="button" onClick={() => setSeleccionada(factura)}>
                                    Ver detalle
                                </BotonDetalle>
                                {aprobada && (
                                    <BotonDescargar type="button" onClick={() => descargarComprobante(factura)}>
                                        Descargar
                                    </BotonDescargar>
                                )}
                            </AccionesTarjeta>
                        </footer>

                        {!aprobada && factura.ultimo_error && (
                            <MensajeError>
                                No pudimos emitir el comprobante todavía. Nuestro equipo lo está revisando.
                            </MensajeError>
                        )}
                    </TarjetaFactura>
                )
            })}

            {pages > 1 && (
                <CambiarPagina paginaActual={page} totalPaginas={pages} onPageChange={cambiarPagina} />
            )}

            {seleccionada && (
                <DetalleFactura
                    factura={seleccionada}
                    onCerrar={() => setSeleccionada(null)}
                    mostrarCliente={false}
                />
            )}
        </MisFacturasContainer>
    )
}

export default MisFacturas
