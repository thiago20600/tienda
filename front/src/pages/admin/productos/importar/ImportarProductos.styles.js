import styled from 'styled-components'

export const ImportarContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
    max-width: 720px;

    form {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        align-items: flex-start;
    }
`

export const DropzoneLabel = styled.label`
    display: block;
    width: 100%;
    padding: 2.5rem 1rem;
    border: 2px dashed var(--border-color, #cbd5e1);
    border-radius: 8px;
    text-align: center;
    cursor: pointer;
    transition: border-color 0.2s ease;

    &:hover {
        border-color: var(--primary-color, #2563eb);
    }
`

export const FileInputHidden = styled.input`
    display: none;
`

export const ColumnasInfo = styled.div`
    background: var(--bg-soft, #f8fafc);
    border-radius: 8px;
    padding: 1rem 1.25rem;

    code {
        display: inline-block;
        margin: 0.35rem 0;
        padding: 0.25rem 0.5rem;
        background: var(--code-bg, #e2e8f0);
        border-radius: 4px;
        font-size: 0.85rem;
    }
`

export const ResultadoBox = styled.div`
    border: 1px solid ${(props) => (props.$esError ? '#ef4444' : 'var(--border-color, #cbd5e1)')};
    border-radius: 8px;
    padding: 1rem 1.25rem;

    h3 {
        margin-bottom: 0.5rem;
    }
`

export const ListaErrores = styled.ul`
    margin-top: 0.5rem;
    padding-left: 1.25rem;
    color: #b91c1c;
`
