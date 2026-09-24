import styled from 'styled-components';

export const FiltrosContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr)) auto;
  gap: 1rem;
  align-items: end;
  padding: 1rem 1.5rem;
  background-color: #ffffff;
  border-bottom: 1px solid #e0e0e0;

  @media (max-width: 900px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
`;

export const Filtro = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
`;

export const FiltroLabel = styled.label`
  color: #555555;
  font-size: 0.8rem;
  font-weight: 600;
`;

const campoFiltro = `
  width: 100%;
  box-sizing: border-box;
  padding: 0.55rem 0.65rem;
  color: #333333;
  background: #ffffff;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  font-size: 0.875rem;

  &:focus {
    outline: 2px solid rgba(0, 158, 227, 0.2);
    border-color: #009ee3;
  }
`;

export const FiltroInput = styled.input`${campoFiltro}`;
export const FiltroSelect = styled.select`${campoFiltro}`;

export const AccionesFiltros = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding-bottom: 0.1rem;
`;

export const MensajeAccion = styled.span`
  color: ${(props) => (props.$error ? '#b91c1c' : '#15803d')};
  font-size: 0.8rem;
  font-weight: 600;
  max-width: 22ch;
`;
