import styled from 'styled-components';

export const AgregarCategoria = styled.div`
  position: relative;
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
  padding: 24px;
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  gap: 16px;
  font-family: system-ui, -apple-system, sans-serif;

  /* Título (<p>) */
  p {
    margin: 0;
    font-size: 1.25rem;
    font-weight: 600;
    color: #1f2937;
  }

  /* Botón de cerrar (X) */
  > button:first-of-type {
    position: absolute;
    top: 16px;
    right: 16px;
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

  /* Formulario */
  form {
    display: flex;
    flex-direction: column;
    gap: 12px;

    label {
      font-size: 0.875rem;
      font-weight: 500;
      color: #4b5563;
      text-transform: capitalize;
    }

    input {
      padding: 10px 12px;
      border: 1px solid #d1d5db;
      border-radius: 8px;
      font-size: 1rem;
      outline: none;
      transition: border-color 0.2s ease, box-shadow 0.2s ease;

      &::placeholder {
        color: #9ca3af;
      }

      &:focus {
        border-color: #2563eb;
        box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.15);
      }
    }

    /* Botón Guardar */
    button[type='submit'] {
      margin-top: 8px;
      padding: 10px 16px;
      background-color: #2563eb;
      color: #ffffff;
      border: none;
      border-radius: 8px;
      font-size: 0.95rem;
      font-weight: 600;
      cursor: pointer;
      transition: background-color 0.2s ease;

      &:hover {
        background-color: #1d4ed8;
      }

      &:active {
        background-color: #1e40af;
      }
    }
  }
`;


export const AgregarCategoriaBoton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 40px;
  padding: 0 20px;
  background-color: #009ee3;
  color: #ffffff;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  text-decoration: none;
  box-sizing: border-box;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #0081b8;
  }
`