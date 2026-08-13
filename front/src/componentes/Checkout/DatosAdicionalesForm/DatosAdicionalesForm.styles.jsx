import styled from "styled-components";

export const FormContainer = styled.div`
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  color: #333333;
  max-width: 500px;
  margin: 0 0 24px 0;
`;

export const FormTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: #333333;
  margin-bottom: 16px;
`;

export const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: 0 12px;
`;

export const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 16px;
  grid-column: ${props => props.$span || 'span 12'};
`;

export const Label = styled.label`
  font-size: 13px;
  font-weight: 500;
  color: #333333;
  margin-bottom: 6px;
`;

export const StyledInput = styled.input`
  width: 100%;
  height: 40px;
  padding: 0 12px;
  font-size: 14px;
  color: #333333;
  background-color: #ffffff;
  border: 1px solid #bfbfbf;
  border-radius: 6px;
  box-sizing: border-box;
  outline: none;
  transition: all 0.2s ease;

  &::placeholder {
    color: #a5a5a5;
  }

  &:focus {
    border-color: #009ee3;
    box-shadow: 0 0 0 1px #009ee3;
  }
`;