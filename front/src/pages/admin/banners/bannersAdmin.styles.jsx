import styled from 'styled-components';

export const BannersContainer = styled.main`
  width: min(1000px, calc(100% - 2rem));
  margin: 2rem auto;
  padding: 1.5rem 2rem;
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  color: #1e293b;
`;

export const BannersHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
  margin-bottom: 1rem;

  h1 {
    margin: 0;
    font-size: 1.5rem;
  }
`;

export const CrearBannerBoton = styled.button`
  padding: 0.6rem 1rem;
  border: 0;
  border-radius: 6px;
  background: ${(props) => props.theme.primary};
  color: #fff;
  font-weight: 700;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover { background: ${(props) => props.theme.secondary}; }
  &:disabled { background: #94a3b8; cursor: not-allowed; }
`;

export const MensajeBanners = styled.p`
  color: ${(props) => (props.$error ? '#b91c1c' : '#166534')};
  font-size: 0.9rem;
`;

/* ---- Modal centrado con overlay ---- */

export const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 100;
  background: rgba(15, 23, 42, 0.55);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
`;

export const ModalContenido = styled.div`
  width: min(480px, 100%);
  max-height: calc(100vh - 2rem);
  overflow-y: auto;
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 20px 45px rgba(0, 0, 0, 0.25);
  padding: 1.5rem;
`;

export const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;

  h2 {
    margin: 0;
    font-size: 1.25rem;
  }

  button {
    background: transparent;
    border: none;
    font-size: 1.1rem;
    font-weight: bold;
    color: #9ca3af;
    cursor: pointer;
    padding: 4px 8px;
    border-radius: 6px;
    transition: all 0.2s ease;

    &:hover {
      background-color: #f3f4f6;
      color: #1f2937;
    }
  }
`;

export const ModalForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 0.9rem;
`;

export const ModalLabel = styled.label`
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  color: #475569;
  font-size: 0.85rem;
  font-weight: 600;
`;

const campoBase = `
  padding: 0.6rem 0.75rem;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  font: inherit;
  color: #1e293b;

  &:focus {
    outline: none;
    border-color: ${(props) => props.theme.primary};
    box-shadow: 0 0 0 3px ${(props) => props.theme.primary}25;
  }
`;

export const ModalInput = styled.input`
  ${campoBase}

  &[type='color'] {
    height: 42px;
    padding: 4px;
    cursor: pointer;
  }

  &[type='file'] {
    font-size: 0.85rem;
  }
`;

export const ModalSelect = styled.select`
  ${campoBase}
  background: #fff;
  cursor: pointer;
`;

export const PreviewImagen = styled.img`
  width: 100%;
  max-height: 160px;
  object-fit: cover;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  background: #f8fafc;
`;

export const ModalAcciones = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.6rem;
  margin-top: 0.5rem;
`;

export const BotonPrimario = styled.button`
  padding: 0.6rem 1.1rem;
  border: 0;
  border-radius: 6px;
  background: ${(props) => props.theme.primary};
  color: #fff;
  font-weight: 700;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover { background: ${(props) => props.theme.secondary}; }
  &:disabled { background: #94a3b8; cursor: not-allowed; }
`;

export const BotonSecundario = styled.button`
  padding: 0.6rem 1.1rem;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  background: #fff;
  color: #334155;
  font-weight: 600;
  cursor: pointer;

  &:hover { border-color: ${(props) => props.theme.primary}; }
`;