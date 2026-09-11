import styled from 'styled-components'
import { NavLink } from 'react-router-dom'

export const SideBarContainer = styled.aside`
  width: 250px;
  min-height: 100vh;
  background-color: #ffffff;
  border-right: 1px solid #e5e7eb;
  padding: 1.5rem 1rem;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;

  @media (max-width: 800px) {
    width: 100%;
    min-height: auto;
    border-right: none;
    border-bottom: 1px solid #e5e7eb;
    padding: 0.75rem;
  }
`

export const SideBarBrand = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0 0.5rem;
`

export const BrandLogo = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 8px;
  background-color: ${(props) => props.theme.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  font-weight: 700;
  font-size: 1.1rem;
`

export const BrandName = styled.span`
  font-size: 1.1rem;
  font-weight: 700;
  color: #1e293b;
`

export const ListaSeccionContainer = styled.nav`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;

  @media (max-width: 800px) {
    flex-direction: row;
    flex-wrap: wrap;
  }
`

export const SeccionItem = styled.li`
  width: 100%;

  @media (max-width: 800px) {
    width: auto;
  }
`

export const SeccionLink = styled(NavLink)`
  display: flex;
  align-items: center;
  padding: 0.625rem 0.875rem;
  color: #475569;
  font-size: 0.9rem;
  font-weight: 500;
  text-decoration: none;
  border-radius: 6px;
  transition: all 0.15s ease-in-out;

  &:hover {
    background-color: ${(props) => props.theme.primary}10;
    color: ${(props) => props.theme.primary};
  }

  &.active {
    background-color: ${(props) => props.theme.primary}15;
    color: ${(props) => props.theme.primary};
    font-weight: 600;
  }
`
