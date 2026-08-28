import styled from 'styled-components';

export const TablaPedidos = styled.div`
  width: 100%;
  padding: 1rem 2rem;
  box-sizing: border-box;

  ul { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 8px; }
  li { background: #ffffff; border: 1px solid #e0e0e0; border-radius: 8px; transition: all 0.2s ease-in-out; }
  li:hover { border-color: #009ee3; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08); transform: translateY(-1px); }
  a { display: grid; grid-template-columns: 1.5fr 2fr 1.2fr 1fr 0.8fr 1.1fr 1fr; gap: 14px; align-items: center; padding: 14px 16px; color: #333333; text-decoration: none; }

  @media (max-width: 650px) {
    a { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 8px; }
  }
`;

export const EncabezadoTabla = styled.div`
  display: grid;
  grid-template-columns: 1.5fr 2fr 1.2fr 1fr 0.8fr 1.1fr 1fr;
  gap: 14px;
  padding: 0 1rem 0.5rem;
  color: #666666;
  font-size: 0.8rem;
  font-weight: 600;

  @media (max-width: 650px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 8px;
  }
`;

export const FilaPedido = styled.span`
  color: ${(props) => {
    if (props.$precio) return '#009ee3';
    if (props.$estado === 'pagado' || props.$estado === 'entregado') return '#15803d';
    if (props.$estado === 'rechazado' || props.$estado === 'cancelado') return '#b91c1c';
    if (props.$estado === 'en_camino' || props.$estado === 'en_proceso') return '#b45309';
    return '#334155';
  }};
  font-size: 0.9rem;
  font-weight: ${(props) => props.$precio || !props.$estado ? 600 : 500};
  text-transform: capitalize;
`;

export const MensajeTabla = styled.p`
  padding: 1.5rem 2rem;
  color: #555555;
`;