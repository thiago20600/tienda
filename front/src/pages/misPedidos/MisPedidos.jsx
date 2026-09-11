import { MisPedidosContainer, Titulo, TarjetaPedido, EncabezadoPedido, EstadoBadge, ListaDetalles, MensajeVacio } from './MisPedidos.styles'
import useMisPedidos from '../../hooks/pedidos/useMisPedidos'
import CambiarPagina from '../../componentes/adminpanel/tablas/CambiarPagina/CambiarPagina.jsx'

const ETIQUETAS_ESTADO = {
    pendiente: 'Pendiente de pago',
    pagado: 'Pagado',
    en_proceso: 'En proceso',
    en_camino: 'En camino',
    entregado: 'Entregado',
    rechazado: 'Rechazado',
    cancelado: 'Cancelado',
}

const MisPedidos = () => {
    const { pedidos, cargando, statusError, page, pages, cambiarPagina } = useMisPedidos({ size: 5 })

    if (cargando) return <MisPedidosContainer><p>Cargando tus pedidos...</p></MisPedidosContainer>
    if (statusError) return <MisPedidosContainer><p>No se pudieron cargar tus pedidos (código: {statusError}).</p></MisPedidosContainer>

    return (
        <MisPedidosContainer>
            <Titulo>Mis pedidos</Titulo>

            {pedidos.length === 0 && (
                <MensajeVacio>Todavía no hiciste ningún pedido.</MensajeVacio>
            )}

            {pedidos.map((pedido) => (
                <TarjetaPedido key={pedido.id}>
                    <EncabezadoPedido>
                        <div>
                            <strong>{pedido.numero_pedido || `Pedido #${pedido.id}`}</strong>
                            <span>{new Date(pedido.created_at).toLocaleDateString('es-AR')}</span>
                        </div>
                        <EstadoBadge $estado={pedido.estado}>
                            <strong>{ETIQUETAS_ESTADO[pedido.estado] || pedido.estado}</strong>
                        </EstadoBadge>
                    </EncabezadoPedido>

                    <ListaDetalles>
                        {pedido.detalles?.map((detalle) => (
                            <li key={detalle.id}>
                                <span>{detalle.cantidad} x {detalle.producto?.nombre}</span>
                                <strong>${detalle.subtotal?.toLocaleString('es-AR')}</strong>
                            </li>
                        ))}
                    </ListaDetalles>

                    <footer>
                        <span>Pago: {pedido.metodo_pago}</span>
                        <strong>Total: ${pedido.precio_total?.toLocaleString('es-AR')}</strong>
                    </footer>
                </TarjetaPedido>
            ))}

            {pages > 1 && (
                <CambiarPagina paginaActual={page} totalPaginas={pages} onPageChange={cambiarPagina} />
            )}
        </MisPedidosContainer>
    )
}

export default MisPedidos
