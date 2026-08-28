import styled from 'styled-components';

export const TablaProductos = styled.div`
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
      border-color: #009ee3;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
      transform: translateY(-1px);
    }
  }

  /* El NavLink ocupa todo el espacio restante antes del botón */
  a {
    flex: 1; /* 👈 Toma todo el ancho disponible */
    display: grid;
    /* Ajustamos las columnas para dejar espacio fluido al contenido */
    grid-template-columns: 60px minmax(0, 2fr) minmax(0, 1.5fr) repeat(4, minmax(0, 1fr));
    align-items: center;
    gap: 16px;
    padding: 12px 16px;
    text-decoration: none;
    color: #333333;
    font-size: 14px;
    min-width: 0;
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

  @media (max-width: 900px) {
    padding: 1rem;
    overflow-x: auto;
    a { min-width: 760px; }
  }
`;

export const MensajeTabla = styled.p`
  padding: 1rem 2rem;
  color: ${({ $error, $success }) => $error ? '#b91c1c' : $success ? '#15803d' : '#64748b'};
`;

export const BotonEliminar = styled.button`
  background: transparent;
  border: none;
  font-size: 1.1rem;
  cursor: pointer;
  padding: 0.5rem 1rem; /* Margen para dar distancia al borde del li */
  margin-right: 8px; /* Un poco de aire contra el borde derecho */
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s ease, transform 0.1s ease;

  &:hover {
    background-color: #fef2f2;
    transform: scale(1.1);
  }

  &:active {
    transform: scale(0.95);
  }
`;

export const BotonEstado = styled.button`
  min-width: 0;
  width: 100%;
  border: 1px solid ${({ $activo }) => ($activo ? '#b7e4c7' : '#f5b7b1')};
  border-radius: 6px;
  padding: 6px 8px;
  background-color: ${({ $activo }) => ($activo ? '#ecfdf3' : '#fff1f0')};
  color: ${({ $activo }) => ($activo ? '#18864b' : '#c0392b')};
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

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