import React from 'react'
import { HeaderContainer, HeaderTitle, HeaderActions, UserAvatar, UserName } from './HeaderAdmin.styles'
import { getSession } from '../../../services/auth/session'

const HeaderAdmin = () => {
    const session = getSession()
    const nombreUsuario = session?.nombre || session?.email?.split('@')[0] || 'Admin'

    return (
        <HeaderContainer>
            <HeaderTitle>Panel de Administración</HeaderTitle>
            <HeaderActions>
                <UserName>{nombreUsuario}</UserName>
                <UserAvatar>{nombreUsuario.charAt(0).toUpperCase()}</UserAvatar>
            </HeaderActions>
        </HeaderContainer>
    )
}

export default HeaderAdmin
