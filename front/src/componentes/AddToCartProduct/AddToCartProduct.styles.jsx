import styled from "styled-components";


export const AddToCartContainer = styled.div`
  width: min(100%, 320px);
  align-self: flex-start;
  box-sizing: border-box;
  background-color: #ffffff;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 2.5rem 1.5rem; 
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);

  display: flex;
  flex-direction: column;
    align-items: flex-start;
  gap: 1.25rem;
  height: fit-content;

  p {
    margin: 0;
    font-size: 0.9rem;
    color: #666666;
    text-transform: capitalize;
  }
`;


export const PrecioProducto = styled.h2`
    margin: 0;
    font-size: 1.5rem;
    font-weight: bold;
    color: #333333;
    
  
    &::before {
        content: "$"; 
        margin-right: 2px;
    }
`




export const AgregarProductoBoton = styled.button`
    width: fit-content;
    align-self: flex-start;
    padding: 0.75rem;
    background-color: #1a1a1a;
    color: #ffffff;
    border: none;
    border-radius: 4px;
    font-size: 0.9rem;
    font-weight: 600;
    cursor: pointer;
    transition: background-color 0.2s ease;

    &:hover {
        background-color: #333333;
    }

    &:active {
        transform: scale(0.98);
    }
`;