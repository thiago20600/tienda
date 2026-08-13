import styled from "styled-components";

export const TablaHeaderContainer = styled.div`
  display: flex;
  align-items: center;
  padding: 0.75rem 1.5rem;
  background-color: #f8f9fa;
  border-bottom: 1px solid #e0e0e0;
`;

export const FiltrosList = styled.ul`
  display: flex;
  gap: 1rem;
  list-style: none;
  margin: 0;
  padding: 0;
`;

export const FiltroItem = styled.li`
  display: flex;
  align-items: center;
`;

export const FiltroBoton = styled.button`
  background: none;
  border: none;
  font-size: 0.9rem;
  font-weight: ${(props) => (props.$active ? '600' : '400')};
  color: ${(props) => (props.$active ? '#009ee3' : '#555555')};
  cursor: pointer;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #e2e8f0;
  }
`;

export const EliminarFiltroBoton = styled.button`
  background: none;
  border: none;
  color: #e53e3e; /* Color rojo sutil */
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  transition: all 0.2s ease;
  margin-left: auto; /* Empuja el botón al extremo derecho del container */

  &:hover {
    background-color: #fff5f5;
    text-decoration: underline;
  }
`;