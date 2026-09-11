import styled from 'styled-components'

export const HeaderContainer = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 2rem;
  background-color: ${(props) => props.theme.primary};
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
`

export const HeaderTitle = styled.h1`
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
   color: ${(props) => props.theme.secondary};
`

export const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`

export const UserName = styled.span`
  font-size: 0.9rem;
  font-weight: 500;
   color: ${(props) => props.theme.secondary};
`

export const UserAvatar = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: ${(props) => props.theme.secondary};
  color: ${(props) => props.theme.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.9rem;
  font-weight: 600;
`
