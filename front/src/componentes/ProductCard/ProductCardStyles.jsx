import styled from 'styled-components'
import { Link } from 'react-router-dom'

export const ProductCardContainer = styled.div`

    display: flex;
    flex-direction: column;
    justify-content: space-between;

    padding: 1rem;
    margin: 1rem;

    width: 200px;
    min-height: 250px;

    border: 1px solid #e0e0e0;
    border-radius: 8px;

    gap: 0.5rem;

    box-sizing: border-box;


`

export const ProductTitle = styled.h3`
    font-size: 1rem;
    margin: 0;
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
`
