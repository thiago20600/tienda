import styled from 'styled-components'

export const ContenedorRol = styled.div`
  position: relative;
  display: inline-block;
`

export const BotonRol = styled.button`
  background-color: ${props => props.$admin ? '#e0e7ff' : '#f3f4f6'};
  color: ${props => props.$admin ? '#3730a3' : '#374151'};
  border: 1px solid ${props => props.$admin ? '#c7d2fe' : '#e5e7eb'};
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
  text-transform: capitalize;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.2s ease;

  &:hover {
    background-color: ${props => props.$admin ? '#c7d2fe' : '#e5e7eb'};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  &::after {
    content: '▾';
    font-size: 0.75rem;
  }
`

export const ListaRoles = styled.ul`
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  min-width: 130px;
  background-color: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  list-style: none;
  padding: 4px 0;
  margin: 0;
  z-index: 50;
  overflow: hidden;
`

export const ItemRol = styled.li`
  margin: 0;
`

export const OpcionRol = styled.button`
  width: 100%;
  text-align: left;
  background: none;
  border: none;
  padding: 8px 12px;
  font-size: 0.85rem;
  color: #1f2937;
  cursor: pointer;
  transition: background 0.15s ease;

  &:hover {
    background-color: #f3f4f6;
    color: #4f46e5;
  }
`

export const MensajeError = styled.span`
  position: absolute;
  top: 100%;
  left: 0;
  font-size: 0.75rem;
  color: #ef4444;
  white-space: nowrap;
  margin-top: 2px;
`