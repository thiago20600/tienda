import { AccionesFiltros, Filtro, FiltroInput, FiltroLabel, FiltroSelect, FiltrosContainer, MensajeAccion } from './FiltrosFacturas.styles';
import AdminButton from '../ui/AdminButton/AdminButton';
import { ESTADOS_FACTURA, etiquetaEstadoFactura } from '../../../utils/facturas';

// Filtros del panel de facturacion. Los nombres coinciden con los query params de
// GET /facturas/ (estado, numero_pedido, user_email).
const FiltrosFacturas = ({ filtros, onFiltroChange, onProcesarPendientes, procesando, mensajeAccion }) => (
    <FiltrosContainer>
        <Filtro>
            <FiltroLabel htmlFor="filtro-factura-estado">Estado</FiltroLabel>
            <FiltroSelect
                id="filtro-factura-estado"
                value={filtros.estado}
                onChange={(event) => onFiltroChange('estado', event.target.value)}
            >
                <option value="">Todos</option>
                {ESTADOS_FACTURA.map((estado) => (
                    <option key={estado} value={estado}>{etiquetaEstadoFactura(estado)}</option>
                ))}
            </FiltroSelect>
        </Filtro>

        <Filtro>
            <FiltroLabel htmlFor="filtro-factura-email">Email del cliente</FiltroLabel>
            <FiltroInput
                id="filtro-factura-email"
                value={filtros.user_email}
                onChange={(event) => onFiltroChange('user_email', event.target.value)}
                placeholder="cliente@correo.com"
            />
        </Filtro>

        <Filtro>
            <FiltroLabel htmlFor="filtro-factura-pedido">Número de pedido</FiltroLabel>
            <FiltroInput
                id="filtro-factura-pedido"
                value={filtros.numero_pedido}
                onChange={(event) => onFiltroChange('numero_pedido', event.target.value)}
                placeholder="PED-202608-0001"
            />
        </Filtro>

        <AccionesFiltros>
            <AdminButton type="button" $variant="ghost" onClick={onProcesarPendientes} disabled={procesando}>
                {procesando ? 'Procesando...' : 'Procesar pendientes'}
            </AdminButton>
            {mensajeAccion && (
                <MensajeAccion $error={Boolean(mensajeAccion.error)}>
                    {mensajeAccion.error || mensajeAccion.texto}
                </MensajeAccion>
            )}
        </AccionesFiltros>
    </FiltrosContainer>
);

export default FiltrosFacturas;
