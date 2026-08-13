import styled from 'styled-components';

export const SearchBarContainer = styled.div`
  position: relative;
  width: 592px;
  height: 42px;
  display: flex;
  align-items: center;
`;

export const SearchInput = styled.input`
  width: 100%;
  height: 100%;
  background: #FFFFFF;
  border-radius: 22px;
  border: none;
  padding: 0 65px 0 23px;
  font-family: 'Inter', sans-serif;
  font-size: 12px;
  color: #333333;
  outline: none;

  &::placeholder {
    color: #999999;
  }
`;

export const SearchButton = styled.button`
  position: absolute;
  right: 4px;
  width: 52.6px;
  height: 34px;
  background-color: #2D2D2D !important; /* Fuerza el fondo oscuro de Figma */
  border-radius: 20px;
  border: none;                          /* Quita el borde negro por defecto */
  outline: none;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  padding: 0;

  &:hover {
    background-color: #1a1a1a !important;
  }

  /* Asegura que el SVG interno se dibuje en blanco */
  svg {
    width: 18px;
    height: 18px;
    stroke: #FFFFFF;
    fill: none;
    stroke-width: 2.5;
    stroke-linecap: round;
    stroke-linejoin: round;
  }
`;