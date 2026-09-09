import styled from "styled-components";

const COLUMNAS = '90px 1.2fr 1.6fr 0.9fr 0.8fr 70px';

export const TablaBanners = styled.div`
  width: 100%;
  box-sizing: border-box;

  ul {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  li {
    width: 100%;
    background-color: #ffffff;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    transition: all 0.2s ease-in-out;

    display: flex;
    align-items: center;
    justify-content: space-between;

    &:hover {
      border-color: #009ee3;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
      transform: translateY(-1px);
    }
  }

  a {
    flex: 1;
    display: grid;
    grid-template-columns: ${COLUMNAS};
    align-items: center;
    gap: 14px;
    padding: 10px 16px;
    text-decoration: none;
    color: #333333;
    font-size: 14px;
    min-width: 0;
  }

  @media (max-width: 750px) {
    overflow-x: auto;
    a { min-width: 640px; }
  }
`;

export const EncabezadoTabla = styled.div`
  display: grid;
  grid-template-columns: ${COLUMNAS};
  gap: 14px;
  padding: 0 1rem 0.6rem;
  color: #666666;
  font-size: 0.8rem;
  font-weight: 600;

  @media (max-width: 750px) {
    min-width: 640px;
  }
`;

export const ImagenBanner = styled.img`
  width: 90px;
  height: 52px;
  object-fit: cover;
  border-radius: 6px;
  background-color: #f5f5f5;
  border: 1px solid #e2e8f0;
`;

export const FilaBanner = styled.span`
  color: #334155;
  font-size: 0.9rem;
  font-weight: ${(props) => (props.$titulo ? 600 : 400)};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const EstadoBadge = styled.span`
  display: inline-block;
  font-size: 0.75rem;
  font-weight: 700;
  padding: 0.15rem 0.55rem;
  border-radius: 999px;
  background: ${(props) => (props.$activo ? '#dcfce7' : '#fee2e2')};
  color: ${(props) => (props.$activo ? '#166534' : '#b91c1c')};
`;

export const BotonPreview = styled.span`
  display: inline-block;
  padding: 0.25rem 0.7rem;
  border-radius: 6px;
  background: ${(props) => props.$color || '#2563eb'};
  color: #ffffff;
  font-size: 0.75rem;
  font-weight: 600;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const BotonEliminar = styled.button`
  background: transparent;
  border: none;
  font-size: 1.1rem;
  cursor: pointer;
  padding: 0.5rem 0.9rem;
  margin-right: 8px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s ease, transform 0.1s ease;

  &:hover:not(:disabled) {
    background-color: #fee2e2;
    transform: scale(0.92);
  }

  &:active:not(:disabled) {
    transform: scale(0.95);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const MensajeTabla = styled.p`
  padding: 1.25rem 0.5rem;
  color: ${(props) => (props.$error ? '#b91c1c' : '#555555')};
  font-size: 0.9rem;
`;