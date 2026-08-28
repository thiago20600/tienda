import styled from 'styled-components';

export const UsuariosContainer = styled.main`
  padding: 2rem;
  color: #1e293b;
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
  @media (max-width: 650px) {
    display: block;
    overflow-x: auto;
    white-space: nowrap;
  }
`;

export const EstadoUsuario = styled.span`
  color: ${(props) => props.$activo ? '#15803d' : '#b45309'};
  font-weight: 600;
`;

export const RolUsuario = styled.span`
  color: ${(props) => props.$admin ? '#0369a1' : '#475569'};
  font-weight: 600;
`;

export const MensajeUsuarios = styled.p`
  padding: 2rem;
  color: ${(props) => props.$error ? '#b91c1c' : '#64748b'};
`;
