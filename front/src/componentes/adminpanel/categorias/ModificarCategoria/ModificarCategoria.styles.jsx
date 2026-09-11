import styled from 'styled-components';

export const CategoriaContainer = styled.main`
  width: min(560px, calc(100% - 2rem));
  margin: 2.5rem auto;
  padding: 2rem;
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  color: #1e293b;
`;

export const CategoriaBack = styled.button`
  padding: 0;
  border: 0;
  background: transparent;
  color: #0369a1;
  cursor: pointer;
`;

export const CategoriaTitle = styled.h1`
  margin: 1.25rem 0;
  font-size: 1.5rem;
`;

export const CategoriaForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const CategoriaLabel = styled.label`
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  color: #475569;
  font-size: 0.85rem;
  font-weight: 600;
`;

export const CategoriaInput = styled.input`
  padding: 0.7rem 0.75rem;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  font: inherit;
`;

export const CategoriaSelect = styled.select`
  padding: 0.7rem 0.75rem;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  background: #fff;
  font: inherit;
`;

export const CategoriaButton = styled.button`
  padding: 0.7rem;
  border: 0;
  border-radius: 6px;
  background: ${(props) => props.theme.primary};
  color: #fff;
  font-weight: 700;
  cursor: pointer;
  &:disabled { background: #94a3b8; cursor: not-allowed; }
`;

export const CategoriaMessage = styled.p`
  color: ${(props) => props.$error ? '#b91c1c' : '#166534'};
`;

export const CategoriaImagenWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

export const CategoriaImagenPreview = styled.img`
  width: 100%;
  max-height: 200px;
  object-fit: cover;
  border-radius: 6px;
  border: 1px solid #e2e8f0;
`;

export const CategoriaImagenActual = styled.img`
  width: 100%;
  max-height: 200px;
  object-fit: cover;
  border-radius: 6px;
  border: 1px solid #e2e8f0;
`;

export const CategoriaImagenInput = styled.input`
  padding: 0.5rem 0;
  font: inherit;
  font-size: 0.85rem;
  color: #475569;
`;

export const CategoriaImagenButton = styled.button`
  padding: 0.6rem 1rem;
  border: 0;
  border-radius: 6px;
  background: #16a34a;
  color: #fff;
  font-weight: 600;
  cursor: pointer;
  &:disabled { background: #94a3b8; cursor: not-allowed; }
`;
