import styled from 'styled-components';

export const ActivateContainer = styled.main`
  width: min(430px, calc(100% - 2rem));
  margin: 4rem auto;
  padding: 2rem;
  text-align: center;
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  color: #1e293b;
`;

export const ActivateTitle = styled.h1`
  margin: 0 0 0.75rem;
  color: ${(props) => props.$error ? '#b91c1c' : '#166534'};
  font-size: 1.4rem;
`;

export const ActivateMessage = styled.p`
  color: #64748b;
`;

export const ActivateLink = styled.a`
  display: inline-block;
  margin-top: 0.75rem;
  padding: 0.7rem 1rem;
  border-radius: 6px;
  background: #009ee3;
  color: #fff;
  font-weight: 700;
  text-decoration: none;
`;
