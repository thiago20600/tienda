import styled from 'styled-components';

export const RegisterContainer = styled.div`
  width: 100%;
  max-width: 350px;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  color: #1e293b;
`;

export const RegisterHeader = styled.div`
  text-align: center;
  h1 { margin: 0; font-size: 1.5rem; }
  p { margin: 0.5rem 0 0; color: #64748b; font-size: 0.9rem; }
`;

export const RegisterForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 0.9rem;
`;

export const Campo = styled.label`
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  color: #475569;
  font-size: 0.85rem;
  font-weight: 600;
`;

export const CampoInput = styled.input`
  box-sizing: border-box;
  width: 100%;
  padding: 0.7rem 0.75rem;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  color: #0f172a;
  font: inherit;
  outline: none;
  &:focus { border-color: #009ee3; box-shadow: 0 0 0 3px rgba(0, 158, 227, 0.15); }
`;

export const RegisterButton = styled.button`
  border: 0;
  border-radius: 6px;
  padding: 0.75rem;
  background: #009ee3;
  color: #fff;
  font-weight: 700;
  cursor: pointer;
  &:disabled { background: #94a3b8; cursor: not-allowed; }
  &:hover:not(:disabled) { background: #0082bd; }
`;

export const FormMessage = styled.p`
  margin: 0;
  color: ${(props) => props.$error ? '#b91c1c' : '#166534'};
  font-size: 0.9rem;
`;

export const LoginLink = styled.p`
  margin: 0;
  text-align: center;
  color: #64748b;
  font-size: 0.9rem;
  a { color: #0082bd; font-weight: 600; }
`;
