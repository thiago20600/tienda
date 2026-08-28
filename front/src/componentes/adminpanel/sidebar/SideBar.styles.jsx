import styled from 'styled-components';
import { NavLink } from 'react-router-dom';

export const SideBarContainer = styled.div`
  width: 250px;
  min-height: 100vh;
  background-color: #ffffff;
  border-right: 1px solid #e0e0e0;
  padding: 1.5rem 1rem;
  box-sizing: border-box;

  @media (max-width: 800px) {
    width: 100%;
    min-height: auto;
    border-right: none;
    border-bottom: 1px solid #e0e0e0;
    padding: 0.75rem;
  }
`;

export const ListaSeccionContainer = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  @media (max-width: 800px) {
    flex-direction: row;
    flex-wrap: wrap;
  }
`;

export const SeccionItem = styled.li`
  width: 100%;

  @media (max-width: 800px) {
    width: auto;
  }
`;

export const SeccionLink = styled(NavLink)`
  display: flex;
  align-items: center;
  padding: 0.75rem 1rem;
  color: #4a5568;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  font-size: 0.95rem;
  font-weight: 500;
  text-decoration: none;
  border-radius: 6px;
  transition: all 0.2s ease-in-out;

  &:hover {
    background-color: #f7fafc;
    color: #1a202c;
  }

  /* React Router le agrega automáticamente la clase .active al link según la ruta actual */
  &.active {
    background-color: #ebf8ff;
    color: #009ee3;
    font-weight: 600;
  }
`;