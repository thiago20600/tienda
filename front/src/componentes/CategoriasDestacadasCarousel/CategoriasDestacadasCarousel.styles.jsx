import styled from 'styled-components';
import { Link } from 'react-router-dom';

export const CategoriasDestacadasWrapper = styled.div`
  display: contents;
`;

export const CategoriaCard = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 86px;
  padding: 0.9rem 1rem;
  background: linear-gradient(135deg, #ffffff 0%, #f1f5f9 100%);
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  text-decoration: none;
  box-shadow: 0 2px 6px rgba(15, 23, 42, 0.05);
  transition: border-color 180ms ease, box-shadow 180ms ease, transform 180ms ease;
  overflow: hidden;

  &:hover {
    border-color: #009ee3;
    box-shadow: 0 6px 16px rgba(0, 158, 227, 0.15);
    transform: translateY(-3px);
  }
`;

export const CategoriaNombre = styled.span`
  color: #1e293b;
  font-size: 0.95rem;
  font-weight: 700;
  text-align: center;
  white-space: normal;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
`;