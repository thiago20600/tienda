import styled from 'styled-components';

export const PaginadorContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin: 1.5rem 0;
  user-select: none;
`;

export const BotonPagina = styled.button`
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
  background-color: #ffffff;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  cursor: pointer;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  transition: all 0.2s ease-in-out;

  &:hover:not(:disabled) {
    background-color: #f9fafb;
    border-color: #9ca3af;
  }

  &:focus-visible {
    outline: 2px solid ${(props) => props.theme.primary};
    outline-offset: 2px;
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
    box-shadow: none;
  }
`;

export const InfoPagina = styled.span`
  font-size: 0.875rem;
  color: #4b5563;
  background-color: #f3f4f6;
  padding: 0.4rem 0.8rem;
  border-radius: 0.375rem;
  border: 1px solid #e5e7eb;

  strong {
    color: #111827;
    font-weight: 600;
  }
`;