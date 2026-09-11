import styled from "styled-components";

export const CategoriasTabla = styled.div`
  width: 100%;
  padding: 1rem 2rem;
  box-sizing: border-box;

  ul {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  li {
    width: 100%;
    background-color: #ffffff;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    transition: all 0.2s ease-in-out;
    
    /* 1. Flexbox para alinear el NavLink y el BotonEliminar en la misma fila */
    display: flex;
    align-items: center;
    justify-content: space-between;

    &:hover {
      border-color: ${(props) => props.theme.primary};
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
      transform: translateY(-1px);
    }
  }

  /* El NavLink ocupa todo el espacio restante antes del botón */
  a {
    flex: 1;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); 
    align-items: center;
    gap: 16px;
    padding: 12px 16px;
    text-decoration: none;
    color: #333333;
    font-size: 14px;
  }

  img {
    width: 50px;
    height: 50px;
    object-fit: cover;
    border-radius: 6px;
    background-color: #f5f5f5;
  }

  p {
    margin: 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;

    /* 1. Nombre del producto */
    &:nth-of-type(1) {
      font-weight: 600;
      color: #1a1a1a;
    }

    /* 2. Categoría */
    &:nth-of-type(2) {
      color: #666666;
      font-size: 13px;
    }

    /* 3. Precio */
    &:nth-of-type(3) {
      font-weight: 600;
      color: #009ee3;
    }

    /* 4. SKU */
    &:nth-of-type(4) {
      color: #777777;
      font-size: 13px;
      font-family: monospace;
    }

    /* 5. Stock */
    &:nth-of-type(5) {
      color: #555555;
      font-weight: 500;
    }
  }
`;

export const BotonDestacar = styled.button`
  background: transparent;
  border: 1px solid ${({ $destacado }) => ($destacado ? '#fde68a' : '#e2e8f0')};
  border-radius: 6px;
  padding: 6px 10px;
  margin-right: 8px;
  background-color: ${({ $destacado }) => ($destacado ? '#fffbeb' : '#f8fafc')};
  color: ${({ $destacado }) => ($destacado ? '#b45309' : '#94a3b8')};
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
  transition: background-color 0.2s ease, transform 0.1s ease;

  span {
    margin-right: 4px;
    font-size: 15px;
  }

  &:hover:not(:disabled) {
    filter: brightness(0.96);
  }

  &:disabled {
    cursor: wait;
    opacity: 0.65;
  }
`;

export const BotonEliminar = styled.button`
  background: transparent;
  border: none;
  font-size: 1.1rem;
  cursor: pointer;
  padding: 0.5rem 1rem;
  margin-right: 8px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s ease, transform 0.1s ease;

  &:hover {
    background-color: red;
    transform: scale(0.90);
  }

  &:active {
    transform: scale(0.95);
  }
`;