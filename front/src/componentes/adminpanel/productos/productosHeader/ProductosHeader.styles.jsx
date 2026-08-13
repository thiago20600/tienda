import { NavLink } from 'react-router-dom';
import styled from 'styled-components';

export const HeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 1.5rem 2rem;
  box-sizing: border-box;
  background-color: #ffffff;
  border-bottom: 1px solid #e0e0e0;
`;

export const ActionsGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

// Botón secundario en formato NavLink
export const ImportarProductos = styled(NavLink)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 40px;
  padding: 0 16px;
  background-color: #ffffff;
  color: #333333;
  border: 1px solid #d9d9d9;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  text-decoration: none;
  box-sizing: border-box;
  transition: all 0.2s ease;

  &:hover {
    background-color: #f5f5f5;
    border-color: #b3b3b3;
  }

  &:active {
    transform: scale(0.98);
  }
`;

// Botón primario en formato NavLink
export const AgregarProducto = styled(NavLink)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 40px;
  padding: 0 20px;
  background-color: #009ee3;
  color: #ffffff;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  text-decoration: none;
  box-sizing: border-box;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #0081b8;
  }

  &:active {
    transform: scale(0.98);
  }
`;