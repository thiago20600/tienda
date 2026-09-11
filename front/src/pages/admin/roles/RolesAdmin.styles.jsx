import styled from 'styled-components';

export const RolesContainer = styled.main`
  width: min(1000px, calc(100% - 2rem));
  margin: 2rem auto;
  padding: 1.5rem 2rem;
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  color: #1e293b;
`;

export const RolesHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
  margin-bottom: 1rem;
`;

export const CrearRolForm = styled.form`
  display: flex;
  gap: 0.5rem;
  align-items: center;
  flex-wrap: wrap;
  margin-bottom: 1.5rem;
`;

export const CrearRolInput = styled.input`
  padding: 0.6rem 0.75rem;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  font: inherit;
`;

export const CrearRolBoton = styled.button`
  padding: 0.6rem 1rem;
  border: 0;
  border-radius: 6px;
  background: ${(props) => props.theme.primary};
  color: #fff;
  font-weight: 700;
  cursor: pointer;
  &:disabled { background: #94a3b8; cursor: not-allowed; }
`;

export const RolCard = styled.section`
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 1rem 1.25rem;
  margin-bottom: 1rem;
`;

export const RolCardHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
`;

export const RolNombre = styled.h2`
  margin: 0;
  font-size: 1.1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

export const RolEstadoBadge = styled.span`
  font-size: 0.75rem;
  font-weight: 700;
  padding: 0.15rem 0.5rem;
  border-radius: 999px;
  background: ${(props) => (props.$activo ? '#dcfce7' : '#fee2e2')};
  color: ${(props) => (props.$activo ? '#166534' : '#b91c1c')};
`;

export const RolAcciones = styled.div`
  display: flex;
  gap: 0.5rem;
`;

export const BotonSecundario = styled.button`
  padding: 0.4rem 0.8rem;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  background: #fff;
  cursor: pointer;
  font-size: 0.85rem;
  &:hover { border-color: #009ee3; }
  &:disabled { opacity: 0.5; cursor: not-allowed; }
`;

export const BotonEliminar = styled(BotonSecundario)`
  color: #b91c1c;
  border-color: #fecaca;
  &:hover { border-color: #b91c1c; }
`;

export const PermisosGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 0.5rem 1rem;
  margin: 1rem 0;
`;

export const PermisoCheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.85rem;
  cursor: pointer;
`;

export const MensajeRoles = styled.p`
  color: ${(props) => (props.$error ? '#b91c1c' : '#166534')};
  font-size: 0.9rem;
`;


export const ModulosContainer = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: 1rem;
    margin: 1.5rem 0;
`

export const ModuloCard = styled.div`
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    padding: 1rem;
    background-color: #f8fafc;
`

export const ModuloHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #cbd5e1;
    padding-bottom: 0.5rem;
    margin-bottom: 0.75rem;

    h4 {
        margin: 0;
        font-size: 0.85rem;
        letter-spacing: 0.05em;
        color: #475569;
    }
`

export const BotonTexto = styled.button`
    background: none;
    border: none;
    color: #2563eb;
    font-size: 0.75rem;
    cursor: pointer;
    padding: 0;
    
    &:hover {
        text-decoration: underline;
    }
`

export const PermisosLista = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
`