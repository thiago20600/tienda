import styled from "styled-components";

export const ContenedorOrden = styled.div`
  width: min(1180px, 100%);
  margin: 0 auto 1.5rem;
  padding: 0 2rem;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  justify-content: flex-end;
`;

export const CampoSelect = styled.select`
  padding: 0.5rem 0.75rem;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  background: #fff;
  font-size: 0.9rem;
  color: #0f172a;
  cursor: pointer;

  &:focus {
    outline: 2px solid #2563eb;
    outline-offset: 1px;
  }
`;

export const BotonDireccion = styled.button`
  padding: 0.5rem 0.75rem;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  background: #fff;
  font-size: 1rem;
  line-height: 1;
  color: #0f172a;
  cursor: pointer;

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }

  &:focus {
    outline: 2px solid #2563eb;
    outline-offset: 1px;
  }
`;
