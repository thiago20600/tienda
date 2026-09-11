import styled from 'styled-components';

export const ProductoFormContainer = styled.div`
  max-width: 700px;
  margin: 2rem auto;
  padding: 2rem;
  background-color: #ffffff;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
`;

export const FormLayout = styled.form`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.25rem;

  .full-width {
    grid-column: 1 / -1;
  }

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

export const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

export const Label = styled.label`
  font-size: 0.875rem;
  font-weight: 500;
  color: #475569;
`;

export const Input = styled.input`
  padding: 0.625rem 0.875rem;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  font-size: 0.95rem;
  color: #0f172a;
  outline: none;
  transition: all 0.2s ease;

  &:focus {
    border-color: #009ee3;
    box-shadow: 0 0 0 3px rgba(0, 158, 227, 0.15);
  }

  &::placeholder {
    color: #94a3b8;
  }
`;

export const TextArea = styled.textarea`
  padding: 0.625rem 0.875rem;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  font-size: 0.95rem;
  color: #0f172a;
  outline: none;
  resize: vertical;
  font-family: inherit;
  transition: all 0.2s ease;

  &:focus {
    border-color: #009ee3;
    box-shadow: 0 0 0 3px rgba(0, 158, 227, 0.15);
  }

  &::placeholder {
    color: #94a3b8;
  }
`;

export const Select = styled.select`
  padding: 0.625rem 0.875rem;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  font-size: 0.95rem;
  color: #0f172a;
  outline: none;
  background-color: #ffffff;
  transition: all 0.2s ease;
  min-height: 80px;

  &:focus {
    border-color: #009ee3;
    box-shadow: 0 0 0 3px rgba(0, 158, 227, 0.15);
  }

  option {
    padding: 4px 8px;
    border-radius: 4px;
  }
`;

export const ImagenesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(110px, 1fr));
  gap: 0.75rem;
  margin-top: 0.5rem;
`;

export const ImagenCard = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);

  img {
    width: 100%;
    height: 90px;
    object-fit: cover;
  }

  span {
    font-size: 0.75rem;
    color: #64748b;
    padding: 6px 4px;
    width: 100%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    text-align: center;
  }
`;

export const PrevisualizacionInfo = styled.p`
  font-size: 0.9rem;
  color: #475569;
  margin-bottom: 0.5rem;

  strong {
    color: #1e293b;
  }
`;

export const DropzoneLabel = styled.label`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2.5rem 1.5rem;
  background-color: #f8fafc;
  border: 2px dashed #cbd5e1;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  text-align: center;

  &:hover {
    border-color: #3b82f6;
    background-color: #eff6ff;
  }

  .dropzone-icon {
    font-size: 2rem;
    margin-bottom: 0.5rem;
  }

  .dropzone-text {
    font-size: 0.95rem;
    font-weight: 500;
    color: #475569;

    strong {
      color: #2563eb;
    }
  }

  .dropzone-subtext {
    font-size: 0.8rem;
    color: #94a3b8;
    margin-top: 0.25rem;
  }
`;

export const FileInputHidden = styled.input`
  display: none;
`;

export const ImagenesExistentesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
  gap: 1rem;
  margin-top: 0.5rem;
`;

export const ImagenExistenteCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.4rem;
  padding: 0.5rem;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
`;

export const ImagenExistenteImg = styled.img`
  width: 100%;
  height: 100px;
  object-fit: cover;
  border-radius: 4px;
`;

export const ImagenExistenteInfo = styled.div`
  font-size: 0.75rem;
  color: #475569;
  display: flex;
  align-items: center;
  gap: 0.3rem;
`;

export const AccionesGrupo = styled.div`
  display: flex;
  gap: 0.75rem;
  margin-top: 1rem;
`;

export const EstadoMensaje = styled.div`
  padding: 0.75rem 1rem;
  border-radius: 6px;
  font-size: 0.9rem;
  font-weight: 500;
  background-color: ${(props) => (props.$esError ? '#fef2f2' : '#f0fdf4')};
  color: ${(props) => (props.$esError ? '#dc2626' : '#16a34a')};
  border: 1px solid ${(props) => (props.$esError ? '#fecaca' : '#bbf7d0')};
`;

export const FormTitle = styled.h2`
  margin-top: 0;
  margin-bottom: 1.5rem;
  color: #1e293b;
  font-size: 1.25rem;
  font-weight: 600;
  border-bottom: 2px solid #f1f5f9;
  padding-bottom: 0.75rem;
`;

export const CargarImagenContainer = styled.div`
  padding: 1.5rem;
  background: #f8fafc;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  text-align: center;
`;

export const CAMPOS_FORMULARIO = [
  { name: 'nombre', label: 'Nombre *', type: 'text', required: true, placeholder: 'Ej: Remera Oversize' },
  { name: 'sku', label: 'SKU (Opcional)', type: 'number', required: false, placeholder: '10024' },
  { name: 'precio', label: 'Precio ($) *', type: 'number', step: '0.01', required: true, placeholder: '1500.50' },
  { name: 'precio_descuento', label: 'Precio promocional ($)', type: 'number', step: '0.01', required: false, placeholder: 'Dejá vacío si no hay descuento' },
  { name: 'stock', label: 'Stock *', type: 'number', required: true, placeholder: '10' },
];

export const FORM_DATA_INITIAL = {
  nombre: '',
  sku: '',
  precio: '',
  precio_descuento: '',
  stock: '',
  descripcion: '',
};
