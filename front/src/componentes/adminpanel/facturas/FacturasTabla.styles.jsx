import styled from 'styled-components';

const COLUMNAS = '0.9fr 1.2fr 1.6fr 1fr 0.9fr 0.9fr 1.7fr';

export const TablaFacturas = styled.div`
  width: 100%;
  padding: 1rem 2rem;
  box-sizing: border-box;

  ul { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 8px; }
  li { background: #ffffff; border: 1px solid #e0e0e0; border-radius: 8px; transition: all 0.2s ease-in-out; }
  li:hover { border-color: #009ee3; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08); }

  @media (max-width: 900px) {
    overflow-x: auto;
  }
`;

export const EncabezadoTabla = styled.div`
  display: grid;
  grid-template-columns: ${COLUMNAS};
  gap: 14px;
  padding: 0 1.5rem 0.5rem;
  color: #666666;
  font-size: 0.8rem;
  font-weight: 600;

  @media (max-width: 900px) {
    min-width: 900px;
    gap: 8px;
  }
`;

export const FilaFactura = styled.div`
  display: grid;
  grid-template-columns: ${COLUMNAS};
  gap: 14px;
  align-items: center;
  padding: 14px 16px;

  @media (max-width: 900px) {
    min-width: 900px;
    gap: 8px;
  }
`;

export const Celda = styled.span`
  font-size: 0.9rem;
  color: ${(props) => (props.$monto ? '#009ee3' : '#334155')};
  font-weight: ${(props) => (props.$monto ? 700 : 500)};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const AccionesFila = styled.span`
  display: flex;
  gap: 0.5rem;
  align-items: center;
`;

export const ErrorFactura = styled.p`
  margin: 0;
  padding: 0 16px 12px;
  color: #b91c1c;
  font-size: 0.8rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const MensajeTabla = styled.p`
  padding: 1.5rem 2rem;
  color: #555555;
`;
