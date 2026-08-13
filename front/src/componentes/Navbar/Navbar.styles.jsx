import styled from 'styled-components';

// Contenedor principal (Encabezado)
export const NavbarContainer = styled.header`
  position: relative;
  width: 100vw;              /* Ocupa el 100% del ancho de la pantalla */
  left: 50%;                 /* Centra el contenedor si hay márgenes en el body */
  right: 50%;
  margin-left: -50vw;
  margin-right: -50vw;
  height: 99px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 5%;              /* Usa porcentaje para padding adaptable */
  background: rgba(59, 197, 197, 0.23);
  box-sizing: border-box;
`;

// Grupos de enlaces flexibles
export const GrupoLinks = styled.nav`
  display: flex;
  align-items: center;
  gap: 24px;

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
`;