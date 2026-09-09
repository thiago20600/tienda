import styled from 'styled-components';
import { Link } from 'react-router-dom';

export const CardItem = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 1rem;
  height: 100%;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  gap: 0.5rem;
  box-sizing: border-box;
  background: #ffffff;
  transition: all 0.2s ease-in-out;

  &:hover {
    border-color: #009ee3;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    transform: translateY(-1px);
  }
`;

export const Card = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

export const CardLink = styled(Link)`
  text-decoration: none;
  color: inherit;
  display: block;
  height: 100%;
`;

export const Imagen = styled.img`
  width: 100%;
  height: 150px;
  object-fit: cover;
  border-radius: 6px;
  background: #f1f5f9;
`;

export const ImgWrap = styled.div`
  position: relative;
  overflow: hidden;
  border-radius: 6px;
`;

export const TituloProducto = styled.h3`
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
  color: #1a1a1a;
`;

export const Info = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

export const Precio = styled.div`
  display: flex;
  align-items: center;
`;

export const NoDisponibleBar = styled.div`
  width: 120%;
  margin-left: -10%;
  background-color: #dc3545;
  color: white;
  text-align: center;
  padding: 0;
  font-size: 14px;
  font-weight: 600;
`;

export const UltimasUnidadesBar = styled.div`
  width: 120%;
  margin-left: -10%;
  background-color: #ffc107;
  color: #212529;
  text-align: center;
  padding: 0;
  font-size: 14px;
  font-weight: 600;
`;
