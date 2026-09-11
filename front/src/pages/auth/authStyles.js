import styled from "styled-components"

export const AuthTitulo = styled.h1`
    margin: 0 0 16px;
    font-size: 1.5rem;
    text-align: center;
`

export const AuthForm = styled.form`
    display: flex;
    flex-direction: column;
    gap: 12px;
`

export const AuthLabel = styled.label`
    font-size: 0.9rem;
    font-weight: 600;
`

export const AuthInput = styled.input`
    padding: 10px 12px;
    border: 1px solid #d1d5db;
    border-radius: 6px;
    font-size: 1rem;

    &:focus {
        outline: 2px solid #2563eb;
        outline-offset: 1px;
    }
`

export const AuthBoton = styled.button`
    padding: 10px 12px;
    border: none;
    border-radius: 6px;
    background: #2563eb;
    color: #fff;
    font-size: 1rem;
    cursor: pointer;

    &:hover:not(:disabled) {
        background: #1d4ed8;
    }

    &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }
`

export const AuthMensaje = styled.p`
    margin: 12px 0 0;
    font-size: 0.9rem;
    text-align: center;
    color: ${props => (props.$error ? '#dc2626' : '#16a34a')};
`

export const AuthLink = styled.p`
    margin: 12px 0 0;
    text-align: center;
    font-size: 0.9rem;

    a {
        color: #2563eb;
    }
`
