import styled from "styled-components";

export const BuscadorInput = styled.input.attrs({
  type: 'text',
  placeholder: 'Buscar...',
})`
  width: 280px;
  height: 40px;
  padding: 0 12px;
  font-size: 14px;
  color: #333333;
  background-color: #ffffff;
  border: 1px solid #d9d9d9;
  border-radius: 6px;
  outline: none;
  transition: all 0.2s ease;

  &::placeholder {
    color: #a0a0a0;
  }

  &:focus {
    border-color: #009ee3;
    box-shadow: 0 0 0 2px rgba(0, 158, 227, 0.2);
  }
`;