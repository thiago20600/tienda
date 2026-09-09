import styled from 'styled-components';
import { NavLink } from 'react-router-dom';

export const UsuariosContainer = styled.main`
  padding: 2rem;
  color: #1e293b;
  overflow-x: auto;
  h1 { margin: 0 0 1.25rem; font-size: 1.5rem; }
  @media (max-width: 600px) { padding: 1rem; }
`;

export const UsuariosTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: #fff;
  border: 1px solid #e2e8f0;
  th, td { padding: 0.85rem 1rem; border-bottom: 1px solid #e2e8f0; text-align: left; }
  th { background: #f8fafc; color: #64748b; font-size: 0.8rem; }
  td { color: #334155; }
  tbody tr[tabindex] { cursor: pointer; outline: none; }
  tbody tr[tabindex]:hover, tbody tr[tabindex][aria-selected='true'] { background: #f0f9ff; }
  tbody tr[tabindex]:focus-visible { box-shadow: inset 0 0 0 2px #009ee3; }
  @media (max-width: 650px) {
    min-width: 620px;
    white-space: nowrap;
  }
`;

export const PedidosUsuario = styled.div`
  padding: 0.5rem 0;

  h2 {
    margin: 0 0 0.75rem;
    font-size: 1rem;
    color: #1e293b;
  }

  p {
    margin: 0;
    color: #64748b;
  }

  ul {
    display: grid;
    gap: 0.5rem;
    margin: 0;
    padding: 0;
    list-style: none;
  }
`;

export const PedidoUsuarioLink = styled(NavLink)`
  display: grid;
  grid-template-columns: 1.5fr 1fr 1fr auto;
  gap: 1rem;
  align-items: center;
  padding: 0.65rem 0.75rem;
  border: 1px solid #dbeafe;
  border-radius: 6px;
  color: #334155;
  text-decoration: none;

  &:hover {
    border-color: #009ee3;
    color: #0369a1;
  }

  span:first-of-type { text-transform: capitalize; }
  span:last-of-type { color: #009ee3; font-weight: 600; }

  @media (max-width: 650px) {
    grid-template-columns: 1fr;
    gap: 0.25rem;
  }
`;

export const EstadoUsuario = styled.span`
  color: ${(props) => props.$activo ? '#15803d' : '#b45309'};
  font-weight: 600;
`;

export const MensajeUsuarios = styled.p`
  padding: 2rem;
  color: ${(props) => props.$error ? '#b91c1c' : '#64748b'};
`;

export const BusquedaContainer = styled.div`
  margin-bottom: 20px;
`;

export const BusquedaInput = styled.input`
  padding: 8px 12px;
  font-size: 14px;
  border: 1px solid #ccc;
  border-radius: 4px;
  width: 300px;
  
  &:focus {
    outline: none;
    border-color: #009ee3;
    box-shadow: 0 0 0 2px rgba(0, 158, 227, 0.1);
  }
`;

export const FiltrosUsuariosContainer = styled.div`
  display: flex;
  align-items: flex-end;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1.25rem;
`;

export const FiltroUsuariosGrupo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
`;

export const FiltroUsuariosLabel = styled.label`
  color: #64748b;
  font-size: 0.8rem;
  font-weight: 600;
`;

export const FiltroUsuariosSelect = styled.select`
  min-height: 38px;
  box-sizing: border-box;
  padding: 0.55rem 0.7rem;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  background: #fff;
  font: inherit;
`;

export const BotonAltaEmpleado = styled.button`
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
  cursor: pointer;
  box-sizing: border-box;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #0081b8;
  }
`;
