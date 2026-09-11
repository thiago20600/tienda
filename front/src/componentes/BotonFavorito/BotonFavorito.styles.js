import styled from "styled-components"

export const BotonCorazon = styled.button`
    background: transparent;
    border: 1px solid #e2e8f0;
    border-radius: 50%;
    width: 42px;
    height: 42px;
    font-size: 20px;
    line-height: 1;
    cursor: pointer;
    color: ${(props) => (props.$activo ? "#e11d48" : "#64748b")};
    display: inline-flex;
    align-items: center;
    justify-content: center;
    transition: border-color 0.2s ease, color 0.2s ease, transform 0.1s ease;

    &:hover {
        border-color: #e11d48;
        color: #e11d48;
    }

    &:active {
        transform: scale(0.92);
    }

    &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }
`
