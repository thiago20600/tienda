import styled from 'styled-components';

export const PrecioContainer = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 0.75rem;
  width: 100%;
`;

export const PrecioAnterior = styled.span`
  display: block;
  color: #94a3b8;
  font-size: ${(props) => props.$compacto ? '0.75rem' : '0.85rem'};
  line-height: 1.2;
  text-decoration: line-through;
`;

export const PrecioActual = styled.strong`
  display: block;
  color: #0f766e;
  font-size: ${(props) => props.$compacto ? '0.95rem' : '1.35rem'};
  line-height: 1.25;
  font-weight: 800;
`;

export const DescuentoBadge = styled.span`
  flex: 0 0 auto;
  padding: 0.25rem 0.45rem;
  border-radius: 999px;
  background: #ccfbf1;
  color: #0f766e;
  font-size: 0.7rem;
  font-weight: 800;
  letter-spacing: 0.02em;
`;
