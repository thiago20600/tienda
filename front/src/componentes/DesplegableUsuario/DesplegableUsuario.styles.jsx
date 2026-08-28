import styled from 'styled-components';
import { NavLink } from 'react-router-dom';

// Contenedor que agrupa el botón y el desplegable
export const MenuContainer = styled.div`
  position: relative;
  display: inline-block;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
`;

// El botón del usuario (disparador)
export const UserButton = styled.button`
  background: #ffffff;
  color: #333333;
  border: 1px solid #dcdcdc;
  padding: 8px 18px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease-in-out;

  &:hover {
    background: #f5f5f5;
    border-color: #b5b5b5;
  }
`;

// El panel flotante (Nav) configurado en columna
export const DropdownNav = styled.nav`
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  min-width: 180px;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
  padding: 6px 0;
  display: flex;
  flex-direction: column; /* Alinea los links uno debajo del otro */
  z-index: 100;
  overflow: hidden;
`;

// Los enlaces del menú (NavLinks)
export const MenuLink = styled(NavLink)`
  display: block;
  padding: 10px 16px;
  color: #4a4a4a;
  font-size: 14px;
  text-decoration: none;
  transition: background-color 0.2s;

  &:hover {
    background-color: #f1f3f5;
    color: #1a1a1a;
  }

  
`;