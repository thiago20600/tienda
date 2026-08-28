import styled from "styled-components";

export const ContadorCantidadContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    background-color: #f5f5f5;
    padding: 0.35rem 0.75rem;
    border-radius: 6px;
    border: 1px solid #e0e0e0;
    width: fit-content;
    margin: 0;
`

const BotonBaseContador = styled.button`
    background: none;
    border: none;
    font-size: 1.2rem;
    font-weight: bold;
    color: #444444;
    cursor: pointer;
    padding: 0 0.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: color 0.2s ease, transform 0.1s ease;

    &:hover {
        color: #000000;
    }

    &:active {
        transform: scale(0.9);
    }

    &:disabled {
        cursor: wait;
        opacity: 0.5;
    }
`

export const BotonDisminuirCantidad = styled(BotonBaseContador)``;
export const BotonAumentarCantidad = styled(BotonBaseContador)``;

export const CantidadProducto = styled.span`
    font-size: 1.1rem;
    font-weight: 600;
    color: #222222;
    min-width: 24px;
    text-align: center;
    user-select: none;
`