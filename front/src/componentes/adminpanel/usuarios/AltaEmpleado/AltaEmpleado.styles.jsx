import styled from 'styled-components';

export const AltaEmpleadoModal = styled.div`
  position: fixed;
  inset: 0;
  z-index: 40;
  background: rgba(15, 23, 42, 0.55);
  display: grid;
  place-items: center;
  padding: 1rem;

  > div {
    width: min(520px, 100%);
    max-height: calc(100vh - 2rem);
    overflow-y: auto;
    background: #ffffff;
    border-radius: 12px;
    box-shadow: 0 20px 45px rgba(0, 0, 0, 0.25);
    padding: 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;

    h2 {
      margin: 0;
      font-size: 1.3rem;
      color: #1e293b;
    }

    form {
      display: flex;
      flex-direction: column;
      gap: 0.85rem;
    }
  }
`;

export const AltaEmpleadoCerrar = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: transparent;
  border: none;
  font-size: 1.1rem;
  font-weight: bold;
  color: #9ca3af;
  cursor: pointer;
  padding: 4px 10px;
  border-radius: 6px;

  &:hover {
    background: #f3f4f6;
    color: #1f2937;
  }
`;

export const AltaEmpleadoLabel = styled.label`
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  color: #475569;
  font-size: 0.85rem;
  font-weight: 600;
`;

export const AltaEmpleadoInput = styled.input`
  padding: 0.6rem 0.7rem;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  font: inherit;
`;

export const AltaEmpleadoSelect = styled.select`
  padding: 0.6rem 0.7rem;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  background: #fff;
  font: inherit;
`;

export const AltaEmpleadoBoton = styled.button`
  padding: 0.7rem;
  border: 0;
  border-radius: 6px;
  background: #009ee3;
  color: #fff;
  font-weight: 700;
  cursor: pointer;

  &:hover {
    background: #0081b8;
  }

  &:disabled {
    background: #94a3b8;
    cursor: not-allowed;
  }
`;

export const AltaEmpleadoError = styled.p`
  margin: 0;
  color: #b91c1c;
  font-size: 0.85rem;
`;

export const AltaEmpleadoMensaje = styled.p`
  margin: 0;
  color: #166534;
  font-size: 0.9rem;
  font-weight: 600;
`;