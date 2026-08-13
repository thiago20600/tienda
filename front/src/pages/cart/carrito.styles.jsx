import styled from 'styled-components';
import { Link } from 'react-router-dom';

export const StyledLink = styled(Link)`
text-decoration: none;
  color: inherit;
  display: block;

  &:hover span {
    color: #2563eb;
  }`

// Agrandamos el max-width a 1100px para que entren bien las dos columnas
export const CarritoContainer = styled.div`
  max-width: 1100px;
  margin: 2rem auto;
  padding: 0 1rem;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
`;


export const ContenidoCarrito = styled.div`
  display: flex;
  gap: 2rem;
  align-items: flex-start;
  width: 100%;

  /* Si la pantalla es chica (celular), se vuelven a apilar verticalmente */
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;


export const ListaItemsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  flex: 1; 
  width: 100%;
`;


export const CarritoResumen = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  background-color: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 1.5rem;
  width: 100%;
  max-width: 350px; /* Ancho fijo para la columna derecha */
  box-sizing: border-box;

  p {
    font-size: 1.1rem;
    font-weight: 600;
    color: #1e293b;
    margin: 0;
  }
`;

export const ItemContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 2rem;
  padding: 1.2rem 1.5rem;
  background-color: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    border-color: #cbd5e1;
  }
`;

export const AtributoItem = styled.span`
  font-size: 0.95rem;
  color: #334155;
  white-space: nowrap;
  
  &:first-child {
    font-weight: 600;
    color: #1e293b;
    margin-right: auto;
  }

  &:last-child {
    font-weight: 700;
    color: #059669;
  }
`;

export const PrecioTotal = styled.span`
  font-size: 1.5rem;
  font-weight: 700;
  color: #059669;
  
  &::before {
    content: "Total: ";
    font-size: 1.1rem;
    font-weight: 600;
    color: #475569;
  }
`;

export const BotonContinuarCompra = styled.button`
  background-color: #2563eb;
  color: #ffffff;
  border: none;
  border-radius: 6px;
  padding: 0.75rem 1rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #1d4ed8;
  }

  &:active {
    background-color: #1e40af;
  }
`;

export const ErrorMessage = styled.p`
  color: #dc2626;
  background-color: #fef2f2;
  border: 1px solid #fee2e2;
  padding: 0.75rem 1rem;
  border-radius: 6px;
  font-size: 0.9rem;
  text-align: center;
  margin-top: 1rem;
`;

export const DeleteButton = styled.button`
    background-color: transparent;
    color: #ff4d4d;
    padding: 8px 12px;
    border-radius: 6px;
    font-size: 0.85rem;
    font-weight: 600;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    transition: all 0.2s ease-in-out;

    &:hover {
        background-color: #ff4d4d;
        color: #ffffff;
        box-shadow: 0 4px 12px rgba(255, 77, 77, 0.2);
    }

    &:active {
        transform: scale(0.96);
    }

    &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }
`;

export const CarritoNotFound = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.1);
  padding: 40px 24px;
  max-width: 480px;
  margin: 40px auto;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;

  h2 {
    color: #333333;
    font-size: 20px;
    font-weight: 600;
    margin: 0 0 12px 0;
  }

  p {
    color: #666666;
    font-size: 15px;
    margin: 0 0 24px 0;
  }

  button {
    width: 100%;
    max-width: 240px;
    height: 48px;
    background-color: #009ee3;
    color: #ffffff;
    border: none;
    border-radius: 6px;
    font-size: 15px;
    font-weight: 600;
    cursor: pointer;
    transition: background-color 0.2s ease-in-out;

    &:hover {
      background-color: #0081b8;
    }

    &:active {
      background-color: #006895;
    }
  }
`;