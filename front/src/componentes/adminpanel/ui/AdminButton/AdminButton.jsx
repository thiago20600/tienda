import styled, { css } from 'styled-components'
import { NavLink } from 'react-router-dom'

const variants = {
    primary: ({ theme }) => css`
        background-color: ${theme.primary};
        color: #ffffff;
        border: none;

        &:hover:not(:disabled) {
            background-color: ${theme.secondary};
        }
    `,
    secondary: ({ theme }) => css`
        background-color: #ffffff;
        color: #374151;
        border: 1px solid #d1d5db;

        &:hover:not(:disabled) {
            border-color: ${theme.primary};
            color: ${theme.primary};
        }
    `,
    danger: css`
        background-color: #dc2626;
        color: #ffffff;
        border: none;

        &:hover:not(:disabled) {
            background-color: #b91c1c;
        }
    `,
    ghost: ({ theme }) => css`
        background-color: transparent;
        color: ${theme.primary};
        border: 1px dashed ${theme.primary};

        &:hover:not(:disabled) {
            background-color: ${theme.primary}10;
        }
    `
}

const sizes = {
    sm: css`
        padding: 0.375rem 0.75rem;
        font-size: 0.8rem;
    `,
    md: css`
        padding: 0.6rem 1.25rem;
        font-size: 0.9rem;
    `,
    lg: css`
        padding: 0.75rem 2rem;
        font-size: 1rem;
    `
}

const botonBase = css`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.4rem;
    font-weight: 600;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.15s ease-in-out;
    text-decoration: none;
    box-sizing: border-box;

    ${({ $variant = 'primary' }) => variants[$variant]}
    ${({ $size = 'md' }) => sizes[$size]}

    &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }
`

const StyledButton = styled.button`
    ${botonBase}
`

const StyledNavLink = styled(NavLink)`
    ${botonBase}
`

const AdminButton = ({ children, $variant = 'primary', $size = 'md', ...props }) => {
    // Si recibe `to`, se renderiza como NavLink para navegar dentro de la app
    if (props.to) {
        return (
            <StyledNavLink $variant={$variant} $size={$size} {...props}>
                {children}
            </StyledNavLink>
        )
    }

    return (
        <StyledButton $variant={$variant} $size={$size} {...props}>
            {children}
        </StyledButton>
    )
}

export default AdminButton