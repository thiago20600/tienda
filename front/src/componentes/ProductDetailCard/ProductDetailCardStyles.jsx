import styled from "styled-components";

export const ProductName = styled.h1`

    margin-bottom: 2rem;

    font-size: 2rem;

    font-weight: 600;

`

export const DescriptionTitle = styled.h2`

    margin-bottom: 0.75rem;

    font-size: 1.4rem;

    font-weight: 500;

`

export const ProductDescription = styled.p`

    line-height: 1.6;

    font-size: 1rem;

`

export const ProductDetailContainer = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%; /* Le decimos que ocupe todo su espacio */
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
    background-color: white;
    gap: 1.5rem;
    padding: 2.5rem;
    box-sizing: border-box;
    height: fit-content;

`;