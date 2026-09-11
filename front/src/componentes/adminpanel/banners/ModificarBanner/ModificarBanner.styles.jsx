import styled from 'styled-components';

export const BannerContainer = styled.main`
  width: min(560px, calc(100% - 2rem));
  margin: 2.5rem auto;
  padding: 2rem;
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  color: #1e293b;
`;

export const BannerBack = styled.button`
  padding: 0;
  border: 0;
  background: transparent;
  color: #0369a1;
  cursor: pointer;
`;

export const BannerTitle = styled.h1`
  margin: 1.25rem 0;
  font-size: 1.5rem;
`;

export const BannerPreview = styled.div`
  margin-bottom: 1.25rem;

  img {
    width: 100%;
    max-height: 180px;
    object-fit: cover;
    border-radius: 8px;
    border: 1px solid #e2e8f0;
    background: #f8fafc;
  }
`;

export const BannerForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const BannerLabel = styled.label`
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  color: #475569;
  font-size: 0.85rem;
  font-weight: 600;
`;

export const BannerInput = styled.input`
  padding: 0.7rem 0.75rem;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  font: inherit;

  &[type='color'] {
    height: 42px;
    padding: 4px;
    cursor: pointer;
  }

  &[type='file'] {
    font-size: 0.85rem;
  }
`;

export const BannerSelect = styled.select`
  padding: 0.7rem 0.75rem;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  background: #fff;
  font: inherit;
`;

export const BannerButton = styled.button`
  padding: 0.7rem;
  border: 0;
  border-radius: 6px;
  background: ${(props) => props.theme.primary};
  color: #fff;
  font-weight: 700;
  cursor: pointer;
  &:disabled { background: #94a3b8; cursor: not-allowed; }
`;

export const BannerMessage = styled.p`
  color: ${(props) => props.$error ? '#b91c1c' : '#166534'};
`;