import styled from 'styled-components'

export const MisPedidosContainer = styled.div`
    max-width: 760px;
    margin: 0 auto;
    padding: 2rem 1rem;
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
`

export const Titulo = styled.h1`
    font-size: 1.6rem;
`

export const TarjetaPedido = styled.article`
    border: 1px solid var(--border-color, #e2e8f0);
    border-radius: 10px;
    padding: 1rem 1.25rem;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;

    footer {
        display: flex;
        justify-content: space-between;
        border-top: 1px solid var(--border-color, #e2e8f0);
        padding-top: 0.75rem;
    }
`

export const EncabezadoPedido = styled.header`
    display: flex;
    justify-content: space-between;
    align-items: center;

    div {
        display: flex;
        flex-direction: column;
    }

    span {
        
        color: var(--text-soft, #000000);
        font-size: 0.85rem;
    }
`

const COLORES_ESTADO = {
    pendiente: '#f59e0b',
    pagado: '#16a34a',
    en_proceso: '#2563eb',
    en_camino: '#7c3aed',
    entregado: '#15803d',
    rechazado: '#dc2626',
    cancelado: '#64748b',
}

export const EstadoBadge = styled.span`
    padding: 0.25rem 0.65rem;
    border-radius: 999px;
    font-size: 0.8rem;
    color: #fff;
    background: ${(props) => COLORES_ESTADO[props.$estado] || '#64748b'};
`

export const ListaDetalles = styled.ul`
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 0.35rem;

    li {
        display: flex;
        justify-content: space-between;
    }
`

export const MensajeVacio = styled.p`
    text-align: center;
    color: var(--text-soft, #64748b);
    padding: 2rem 0;
`
