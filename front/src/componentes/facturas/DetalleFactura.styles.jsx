import styled from 'styled-components';

// El ThemeProvider solo envuelve el layout admin: en la vista de cliente hay que
// caer a un color por defecto.
const colorPrincipal = (props) => props.theme?.primary || '#009ee3';

export const Overlay = styled.div`
    position: fixed;
    inset: 0;
    background: rgba(15, 23, 42, 0.45);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1rem;
    z-index: 1000;
`;

export const Modal = styled.div`
    width: 100%;
    max-width: 620px;
    max-height: 90vh;
    overflow-y: auto;
    background: #ffffff;
    border-radius: 10px;
    box-shadow: 0 12px 32px rgba(0, 0, 0, 0.2);
    padding: 1.25rem 1.5rem 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
`;

export const EncabezadoModal = styled.header`
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 1rem;

    h2 {
        margin: 0;
        font-size: 1.15rem;
    }

    p {
        margin: 0.25rem 0 0;
        color: #64748b;
        font-size: 0.85rem;
    }
`;

export const CerrarBoton = styled.button`
    border: none;
    background: transparent;
    color: #64748b;
    font-size: 1.25rem;
    line-height: 1;
    cursor: pointer;

    &:hover { color: #1f2937; }
`;

export const Seccion = styled.section`
    display: flex;
    flex-direction: column;
    gap: 0.35rem;

    h3 {
        margin: 0;
        font-size: 0.9rem;
        color: #475569;
        text-transform: uppercase;
        letter-spacing: 0.03em;
    }
`;

export const Dato = styled.div`
    display: flex;
    justify-content: space-between;
    gap: 1rem;
    border-bottom: 1px solid #f1f5f9;
    padding: 0.35rem 0;
    font-size: 0.9rem;

    span { color: #64748b; }
    strong { text-align: right; word-break: break-word; }
    ${(props) => props.$total && 'font-size: 1rem; border-bottom: none;'}
`;

export const TablaIva = styled.table`
    width: 100%;
    border-collapse: collapse;
    font-size: 0.85rem;

    th, td { border: 1px solid #e2e8f0; padding: 0.4rem 0.5rem; text-align: left; }
    th { background: #f8fafc; color: #475569; }
`;

export const MensajeError = styled.p`
    margin: 0;
    padding: 0.6rem 0.75rem;
    border-radius: 6px;
    font-size: 0.85rem;
    background: #fef2f2;
    border: 1px solid #fecaca;
    color: #b91c1c;
    white-space: pre-wrap;
    word-break: break-word;
`;

export const MensajeInfo = styled.p`
    margin: 0;
    padding: 0.6rem 0.75rem;
    border-radius: 6px;
    font-size: 0.85rem;
    background: #eff6ff;
    border: 1px solid #bfdbfe;
    color: #1d4ed8;
`;

export const AccionesModal = styled.footer`
    display: flex;
    flex-wrap: wrap;
    gap: 0.6rem;
    justify-content: flex-end;

    button {
        padding: 0.55rem 1rem;
        border-radius: 6px;
        font-size: 0.875rem;
        font-weight: 600;
        cursor: pointer;
        border: 1px solid transparent;
    }

    button:disabled { opacity: 0.6; cursor: not-allowed; }

    .descargar, .reintentar {
        background: ${colorPrincipal};
        color: #ffffff;
        border-color: ${colorPrincipal};

        &:hover:not(:disabled) { opacity: 0.9; }
    }

    .cerrar {
        background: #ffffff;
        color: #374151;
        border-color: #d1d5db;

        &:hover { border-color: ${colorPrincipal}; color: ${colorPrincipal}; }
    }
`;
