import styled from 'styled-components';

export const FiltrosProductosContainer = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  gap: 1rem;
  padding: 1rem 2rem 0;
  @media (max-width: 700px) { grid-template-columns: 1fr; }
`;

export const FiltroGrupo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
`;

export const FiltroLabel = styled.label`
  color: #64748b;
  font-size: 0.8rem;
  font-weight: 600;
`;

export const FiltroInput = styled.input`
  min-height: 38px;
  box-sizing: border-box;
  padding: 0.55rem 0.7rem;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  font: inherit;
`;

export const FiltroSelect = styled.select`
  min-height: 38px;
  box-sizing: border-box;
  padding: 0.55rem 0.7rem;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  background: #fff;
  font: inherit;
`;
