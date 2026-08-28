import styled from 'styled-components';

export const ConfigContainer = styled.main`
  width: min(620px, calc(100% - 2rem));
  margin: 3rem auto;
  padding: 2rem;
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  color: #1e293b;
  p { color: #64748b; }
`;

export const ConfigTitle = styled.h1`
  margin: 0;
  font-size: 1.5rem;
`;

export const ConfigForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const ConfigLabel = styled.label`
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  color: #475569;
  font-size: 0.85rem;
  font-weight: 600;
`;

export const ConfigInput = styled.input`
  padding: 0.7rem 0.75rem;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  font: inherit;
  &:focus { border-color: #009ee3; outline: 2px solid rgba(0, 158, 227, 0.2); }
`;

export const ConfigButton = styled.button`
  padding: 0.7rem;
  border: 0;
  border-radius: 6px;
  background: #009ee3;
  color: #fff;
  font-weight: 700;
  cursor: pointer;
  &:disabled { background: #94a3b8; cursor: not-allowed; }
`;

export const ConfigMessage = styled.p`
  color: ${(props) => props.$error ? '#b91c1c' : '#166534'} !important;
`;
