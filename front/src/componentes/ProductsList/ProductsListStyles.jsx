import styled from "styled-components"

export const ProductsListContainer = styled.div`
    display: grid;

    grid-template-columns: repeat(4, 1fr);

    gap: 1rem;

    padding: 1.5rem;
    max-width: 1280px;
    margin: 0 auto;

    width: 100%;

    box-sizing: border-box;

    @media (max-width: 900px) { grid-template-columns: repeat(3, 1fr); }
    @media (max-width: 650px) { grid-template-columns: repeat(2, 1fr); gap: 1rem; padding: 1rem; }
    @media (max-width: 420px) { grid-template-columns: 1fr; }
`

export const EmptyProducts = styled.main`
    display: grid;
    place-content: center;
    min-height: 40vh;
    gap: 0.5rem;
    padding: 2rem;
    text-align: center;
    color: #1e293b;

    h2, p { margin: 0; }
    p { color: #64748b; }
`