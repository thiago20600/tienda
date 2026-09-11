import styled from 'styled-components'
import { Link } from 'react-router-dom'

export const ProductCardContainer = styled.div`

    position: relative;

    display: flex;
    flex-direction: column;
    justify-content: space-between;

    padding: 1rem;

    width: 100%;
    min-height: 280px;

    border: 1px solid #e0e0e0;
    border-radius: 8px;

    gap: 0.5rem;

    box-sizing: border-box;

    background: #ffffff;

    transition: border-color 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease;

    &:hover {
        border-color: #0369a1;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
        transform: translateY(-2px);
    }

`

export const ProductTitle = styled.h3`
    font-size: 1rem;
    margin: 0;
`

export const ProductImage = styled.img`
    width: 100%;
    height: 150px;
    object-fit: cover;
    border-radius: 6px;
    background: #f1f5f9;
`

export const ProductItem = styled.p`
    margin: 0;
`

export const ProductInfo = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
`


export const ProductLink = styled(Link)`
    text-decoration: none;
    color: inherit;

    display: block;
    height: 100%;
`

export const NoDisponibleBar = styled.div`
    width: 112%;
    margin-left: -6%;
    background-color: #dc3545;
    color: white;
    text-align: center;
    padding: 0;
    font-size: 14px;
    font-weight: 600;
`;

export const UltimasUnidadesBar = styled.div`
    width: 112%;
    margin-left: -6%;
    background-color: #ffc107;
    color: #212529;
    text-align: center;
    padding: 0;
    font-size: 14px;
    font-weight: 600;
    border-radius: 10px;
`;