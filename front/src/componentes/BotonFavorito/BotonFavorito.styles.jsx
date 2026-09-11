import styled from "styled-components";

export const BotonCorazon = styled.button`
    position: absolute;
    top: 0.5rem;
    right: 0.5rem;
    z-index: 2;

    width: 2rem;
    height: 2rem;
    display: flex;
    align-items: center;
    justify-content: center;

    border: none;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.85);
    box-shadow: 0 1px 4px rgba(15, 23, 42, 0.15);

    font-size: 1.1rem;
    line-height: 1;
    color: ${($props) => ($props.$activo ? "#e11d48" : "#64748b")};

    cursor: pointer;
    transition: transform 0.15s ease, color 0.15s ease;

    &:hover {
        transform: scale(1.12);
        color: #e11d48;
    }

    &:focus-visible {
        outline: 2px solid #2563eb;
        outline-offset: 1px;
    }
`;
