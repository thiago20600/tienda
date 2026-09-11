import styled from 'styled-components';

export const DetalleContainer = styled.div`
  max-width: 1100px;
  margin: 0 auto;
  padding: 2rem;
  color: #1e293b;

  @media (max-width: 650px) {
    padding: 1rem;
  }
`;

export const EncabezadoDetalle = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
  margin-bottom: 1.5rem;

  h1 { margin: 0.25rem 0 0; font-size: 1.6rem; }
  @media (max-width: 650px) { flex-direction: column; }
`;

export const BotonVolver = styled.button`
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  background: #fff;
  color: #475569;
  padding: 0.6rem 0.9rem;
  cursor: pointer;
  &:hover { border-color: #009ee3; color: #009ee3; }
`;

export const GridResumen = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 1rem;
  margin-bottom: 1rem;
  @media (max-width: 800px) { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  @media (max-width: 450px) { grid-template-columns: 1fr; }
`;

export const ResumenItem = styled.div`
  padding: 1rem;
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  strong { display: block; margin-top: 0.35rem; color: #0f172a; word-break: break-word; }
  span { color: #64748b; font-size: 0.8rem; }
`;

export const Seccion = styled.section`
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 1.25rem;
  margin-top: 1rem;
  h2 { margin: 0 0 1rem; font-size: 1.1rem; }
`;

export const TablaProductos = styled.div`
  overflow-x: auto;
  table { width: 100%; border-collapse: collapse; min-width: 520px; }
  th, td { padding: 0.75rem 0.5rem; border-bottom: 1px solid #e2e8f0; text-align: left; }
  th { color: #64748b; font-size: 0.8rem; font-weight: 600; }
  td:last-child, th:last-child { text-align: right; }
`;

export const ProductoInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  img { width: 42px; height: 42px; object-fit: cover; border-radius: 4px; background: #f1f5f9; }
`;

export const FormularioEstado = styled.div`
  display: grid;
  grid-template-columns: minmax(180px, 260px) 1fr auto;
  gap: 1rem;
  align-items: end;
  label { display: flex; flex-direction: column; gap: 0.45rem; color: #475569; font-size: 0.85rem; }
  select, textarea { border: 1px solid #cbd5e1; border-radius: 6px; padding: 0.65rem 0.75rem; font: inherit; color: #0f172a; }
  textarea { min-height: 40px; resize: vertical; }
  @media (max-width: 700px) { grid-template-columns: 1fr; align-items: stretch; }
`;

export const BotonGuardar = styled.button`
  border: 0;
  border-radius: 6px;
  padding: 0.7rem 1rem;
  background: ${(props) => props.theme.primary};
  color: #fff;
  font-weight: 600;
  cursor: pointer;
  &:disabled { background: #94a3b8; cursor: not-allowed; }
  &:hover:not(:disabled) { background: #0082bd; }
`;

export const Mensaje = styled.p`
  color: ${(props) => props.$error ? '#b91c1c' : '#166534'};
  margin: 0.75rem 0 0;
`;
