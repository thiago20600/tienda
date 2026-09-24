import styled from 'styled-components';
import { COLORES_ESTADO_FACTURA } from '../../utils/facturas';

export const BadgeEstado = styled.span`
    display: inline-block;
    padding: 0.25rem 0.65rem;
    border-radius: 999px;
    font-size: 0.8rem;
    color: #ffffff;
    white-space: nowrap;
    background: ${(props) => COLORES_ESTADO_FACTURA[props.$estado] || '#64748b'};
`;
