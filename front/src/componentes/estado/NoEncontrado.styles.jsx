import styled from 'styled-components';
import { Link } from 'react-router-dom';

export const EstadoContainer = styled.main`
  min-height: 60vh;
  display: grid;
  place-content: center;
  justify-items: center;
  gap: 0.75rem;
  padding: 2rem;
  text-align: center;
  color: #1e293b;

  span { color: #009ee3; font-size: 4rem; font-weight: 800; line-height: 1; }
  h1, p { margin: 0; }
  p { color: #64748b; }
`;

export const EstadoLink = styled(Link)`
  margin-top: 0.75rem;
  padding: 0.7rem 1rem;
  border-radius: 6px;
  background: #009ee3;
  color: #fff;
  font-weight: 600;
  text-decoration: none;
  &:hover { background: #0082bd; }
`;
