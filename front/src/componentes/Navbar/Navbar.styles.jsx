import styled from 'styled-components';
import { NavLink } from 'react-router-dom';

// Contenedor principal (Encabezado)
export const NavbarContainer = styled.header`
  position: relative;
  width: 100vw;              /* Ocupa el 100% del ancho de la pantalla */
  left: 50%;                 /* Centra el contenedor si hay márgenes en el body */
  right: 50%;
  margin-left: -50vw;
  margin-right: -50vw;
  min-height: 99px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 5%;              /* Usa porcentaje para padding adaptable */
  background: rgba(59, 197, 197, 0.23);
  box-sizing: border-box;

  @media (max-width: 760px) {
    flex-direction: column;
    align-items: stretch;
    gap: 1rem;
    padding: 1rem 5%;
  }
`;

// Grupos de enlaces flexibles
export const GrupoLinks = styled.nav`
  display: flex;
  align-items: center;
  gap: 24px;
  flex-wrap: wrap;

  /* Estilos para los enlaces <a> dentro del grupo */
  a {
    font-family: 'Inter', sans-serif;
    font-style: normal;
    font-weight: 400;
    font-size: 16px;
    line-height: 19px;
    color: #333333;
    text-decoration: none;
    transition: color 0.2s ease;

    &:hover {
      color: #000000;
    }
  }

  /* Estilo para el botón de usuario autenticado */
  button {
    font-family: 'Inter', sans-serif;
    font-style: normal;
    font-weight: 400;
    font-size: 16px;
    color: #333333;
    background: transparent;
    border: 1px solid #333333;
    border-radius: 18px;
    padding: 6px 16px;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
      background: #333333;
      color: #ffffff;
    }
  }

  @media (max-width: 760px) {
    justify-content: flex-start;
    gap: 12px 18px;
  }
`;

export const Marca = styled(NavLink)`
  display: flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
  color: #1a1a1a;
  font-family: 'Inter', sans-serif;
  font-weight: 700;
  font-size: 18px;
  white-space: nowrap;

  img {
    width: 42px;
    height: 42px;
    object-fit: contain;
    border-radius: 8px;
    background-color: #ffffff;
  }
`;
