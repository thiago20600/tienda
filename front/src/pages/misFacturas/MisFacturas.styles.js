import styled from 'styled-components'

// Estilos propios: la vista de cliente vive fuera del ThemeProvider del admin,
// asi que no se usan colores del theme.
export const MisFacturasContainer = styled.div`
    max-width: 820px;
    margin: 0 auto;
    padding: 2rem 1rem;
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
`

export const Titulo = styled.h1`
    font-size: 1.6rem;
    margin: 0;
`

export const Subtitulo = styled.p`
    margin: 0;
    color: #64748b;
    font-size: 0.9rem;
`

export const TarjetaFactura = styled.article`
    border: 1px solid var(--border-color, #e2e8f0);
    border-radius: 10px;
    padding: 1rem 1.25rem;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;

    footer {
        display: flex;
        flex-wrap: wrap;
        gap: 0.75rem;
        align-items: center;
        justify-content: space-between;
        border-top: 1px solid var(--border-color, #e2e8f0);
        padding-top: 0.75rem;
    }
`

export const EncabezadoFactura = styled.header`
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;

    div {
        display: flex;
        flex-direction: column;
        gap: 0.15rem;
    }

    span {
        color: #64748b;
        font-size: 0.85rem;
    }
`

export const DatosFiscales = styled.dl`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 0.5rem 1rem;
    margin: 0;

    div {
        display: flex;
        flex-direction: column;
    }

    dt {
        color: #64748b;
        font-size: 0.78rem;
    }

    dd {
        margin: 0;
        font-size: 0.9rem;
        font-weight: 600;
        word-break: break-word;
    }
`

export const PrecioTotal = styled.strong`
    font-size: 1.05rem;
`

export const AccionesTarjeta = styled.div`
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
`

const botonBase = `
    padding: 0.5rem 0.9rem;
    border-radius: 6px;
    font-size: 0.85rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.15s ease-in-out;

    &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }
`

export const BotonDetalle = styled.button`
    ${botonBase}
    background: #ffffff;
    color: #374151;
    border: 1px solid #d1d5db;

    &:hover:not(:disabled) {
        border-color: #009ee3;
        color: #009ee3;
    }
`

export const BotonDescargar = styled.button`
    ${botonBase}
    background: #009ee3;
    color: #ffffff;
    border: 1px solid #009ee3;

    &:hover:not(:disabled) {
        background: #0081b8;
        border-color: #0081b8;
    }
`

export const MensajeVacio = styled.p`
    text-align: center;
    color: #64748b;
    padding: 2rem 0;
`

export const MensajeError = styled.p`
    margin: 0;
    padding: 0.75rem 1rem;
    border-radius: 8px;
    background: #fef2f2;
    border: 1px solid #fecaca;
    color: #b91c1c;
    font-size: 0.9rem;
`

export const MensajeAviso = styled.p`
    margin: 0;
    padding: 0.75rem 1rem;
    border-radius: 8px;
    background: #fffbeb;
    border: 1px solid #fde68a;
    color: #92400e;
    font-size: 0.9rem;
`
