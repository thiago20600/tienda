import { BadgeEstado } from './EstadoFacturaBadge.styles';
import { etiquetaEstadoFactura } from '../../utils/facturas';

// Badge de estado de factura, compartido por la vista de cliente y el panel admin.
const EstadoFacturaBadge = ({ estado }) => (
    <BadgeEstado $estado={estado}>
        <strong>{etiquetaEstadoFactura(estado)}</strong>
    </BadgeEstado>
);

export default EstadoFacturaBadge;
