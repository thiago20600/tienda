import styled from "styled-components"

export const ConfiguracionContainer = styled.div`
    padding: 2rem;
    max-width: 900px;
    margin: 0 auto;
`

export const ConfiguracionHeader = styled.div`
    margin-bottom: 2rem;
`

export const ConfiguracionTitulo = styled.h1`
    font-size: 1.75rem;
    font-weight: 700;
    color: #1a1a2e;
    margin: 0;
`

export const ConfiguracionSubtitulo = styled.p`
    font-size: 0.9rem;
    color: #6b7280;
    margin: 0.5rem 0 0 0;
`

export const Card = styled.div`
    background: #ffffff;
    border-radius: 12px;
    border: 1px solid #e5e7eb;
    padding: 1.5rem;
    margin-bottom: 1.5rem;
`

export const CardTitulo = styled.h2`
    font-size: 1.1rem;
    font-weight: 600;
    color: #1a1a2e;
    margin: 0 0 1.25rem 0;
`

export const FormGroup = styled.div`
    margin-bottom: 1.25rem;

    &:last-child {
        margin-bottom: 0;
    }
`

export const Label = styled.label`
    display: block;
    font-size: 0.875rem;
    font-weight: 500;
    color: #374151;
    margin-bottom: 0.5rem;
`

export const Input = styled.input`
    width: 100%;
    padding: 0.625rem 0.875rem;
    border: 1px solid #d1d5db;
    border-radius: 8px;
    font-size: 0.9rem;
    color: #1f2937;
    background: #f9fafb;
    transition: border-color 0.2s, box-shadow 0.2s;
    box-sizing: border-box;

    &:focus {
        outline: none;
        border-color: ${(props) => props.theme.primary};
        box-shadow: 0 0 0 3px ${(props) => props.theme.primary}25;
        background: #ffffff;
    }
`

export const Select = styled.select`
    width: 100%;
    padding: 0.625rem 0.875rem;
    border: 1px solid #d1d5db;
    border-radius: 8px;
    font-size: 0.9rem;
    color: #1f2937;
    background: #f9fafb;
    transition: border-color 0.2s, box-shadow 0.2s;
    box-sizing: border-box;
    cursor: pointer;

    &:focus {
        outline: none;
        border-color: ${(props) => props.theme.primary};
        box-shadow: 0 0 0 3px ${(props) => props.theme.primary}25;
        background: #ffffff;
    }
`


export const ColorSection = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1rem;
`

export const ColorRow = styled.div`
    display: flex;
    align-items: center;
    gap: 1rem;
`

export const ColorPreview = styled.div`
    width: 48px;
    height: 48px;
    border-radius: 10px;
    background: ${(props) => props.$color || '#e5e7eb'};
    border: 2px solid #e5e7eb;
    flex-shrink: 0;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
`

export const ColorInfo = styled.div`
    flex: 1;
`

export const ColorLabel = styled.span`
    font-size: 0.8rem;
    font-weight: 500;
    color: #6b7280;
    text-transform: uppercase;
    letter-spacing: 0.5px;
`

export const ColorHex = styled.span`
    font-size: 0.85rem;
    color: #374151;
    font-family: 'SF Mono', 'Fira Code', monospace;
    margin-left: 0.5rem;
`

export const PaletaContainer = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 0.6rem;
    padding: 1rem;
    background: #f9fafb;
    border-radius: 10px;
    border: 1px solid #e5e7eb;
`

export const ColorSwatch = styled.button`
    width: 36px;
    height: 36px;
    border-radius: 8px;
    background: ${(props) => props.$color};
    border: ${(props) => props.$selected ? '3px solid #1a1a2e' : '2px solid transparent'};
    cursor: pointer;
    transition: transform 0.15s, box-shadow 0.15s, border-color 0.15s;
    position: relative;
    padding: 0;

    &:hover {
        transform: scale(1.15);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }

    ${(props) => props.$selected && `
        transform: scale(1.1);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    `}
`

export const ColorPickerRow = styled.div`
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin-top: 0.5rem;
`

export const ColorInputNative = styled.input`
    width: 44px;
    height: 44px;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    padding: 0;
    background: transparent;

    &::-webkit-color-swatch-wrapper {
        padding: 0;
    }

    &::-webkit-color-swatch {
        border: 2px solid #e5e7eb;
        border-radius: 8px;
    }
`

export const ColorInputHex = styled.input`
    width: 100px;
    padding: 0.5rem 0.75rem;
    border: 1px solid #d1d5db;
    border-radius: 6px;
    font-size: 0.85rem;
    color: #1f2937;
    background: #f9fafb;
    font-family: 'SF Mono', 'Fira Code', monospace;
    text-transform: uppercase;

    &:focus {
        outline: none;
        border-color: ${(props) => props.theme.primary};
        background: #ffffff;
    }
`
export const ListaItems = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    margin-bottom: 0.75rem;
`

export const ItemRow = styled.div`
    display: flex;
    align-items: center;
    gap: 0.5rem;
`

export const ItemInput = styled.input`
    flex: 1;
    padding: 0.5rem 0.75rem;
    border: 1px solid #d1d5db;
    border-radius: 6px;
    font-size: 0.85rem;
    color: #1f2937;
    background: #f9fafb;
    transition: border-color 0.2s;

    &:focus {
        outline: none;
        border-color: ${(props) => props.theme.primary};
        background: #ffffff;
    }
`

export const BotonIcono = styled.button`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-size: 1rem;
    transition: background 0.2s;
    flex-shrink: 0;

    ${(props) => props.$variant === 'eliminar' && `
        background: #fee2e2;
        color: #dc2626;
        &:hover { background: #fecaca; }
    `}

    ${(props) => props.$variant === 'agregar' && `
        background: #dbeafe;
        color: #2563eb;
        &:hover { background: #bfdbfe; }
    `}
`

export const BotonAgregar = styled.button`
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    padding: 0.5rem 0.875rem;
    border: 1px dashed ${(props) => props.theme.primary};
    border-radius: 8px;
    background: ${(props) => props.theme.primary}10;
    color: ${(props) => props.theme.primary};
    font-size: 0.85rem;
    font-weight: 500;
    cursor: pointer;
    transition: background 0.2s;

    &:hover {
        background: #e0e7ff;
    }
`

export const LogoPreview = styled.div`
    width: 120px;
    height: 120px;
    border-radius: 12px;
    border: 2px dashed #d1d5db;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    margin-bottom: 1rem;
    background: #f9fafb;

    img {
        width: 100%;
        height: 100%;
        object-fit: contain;
    }

    span {
        font-size: 0.8rem;
        color: #9ca3af;
    }
`

export const LogoUpload = styled.div`
    display: flex;
    align-items: center;
    gap: 1rem;
`

export const InputFile = styled.input`
    font-size: 0.85rem;
    color: #6b7280;

    &::file-selector-button {
        padding: 0.5rem 1rem;
        border: 1px solid #d1d5db;
        border-radius: 6px;
        background: #ffffff;
        color: #374151;
        font-size: 0.85rem;
        cursor: pointer;
        margin-right: 0.75rem;
        transition: background 0.2s;

        &:hover {
            background: #f3f4f6;
        }
    }
`

export const BotonGuardar = styled.button`
    padding: 0.75rem 2rem;
    border: none;
    border-radius: 8px;
    background: ${(props) => props.theme.primary};
    color: #ffffff;
    font-size: 0.9rem;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.2s;

    &:hover:not(:disabled) {
        background: ${(props) => props.theme.secondary};
    }

    &:disabled {
        background: #9ca3af;
        cursor: not-allowed;
    }
`

export const BotonCancelar = styled.button`
    padding: 0.75rem 1.5rem;
    border: 1px solid #d1d5db;
    border-radius: 8px;
    background: #ffffff;
    color: #374151;
    font-size: 0.9rem;
    font-weight: 500;
    cursor: pointer;
    transition: background 0.2s;

    &:hover {
        background: #f3f4f6;
    }
`

export const BotonesContainer = styled.div`
    display: flex;
    gap: 0.75rem;
    margin-top: 2rem;
    padding-top: 1.5rem;
    border-top: 1px solid #e5e7eb;
`

export const MensajeError = styled.p`
    color: #dc2626;
    font-size: 0.85rem;
    margin: 0.5rem 0 0 0;
`

export const MensajeExito = styled.p`
    color: #16a34a;
    font-size: 0.85rem;
    margin: 0.5rem 0 0 0;
`
