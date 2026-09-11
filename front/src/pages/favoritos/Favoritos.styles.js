import styled from "styled-components"

export const FavoritosContainer = styled.section`
    padding: 32px 24px;
    max-width: 1200px;
    margin: 0 auto;
`

export const Titulo = styled.h1`
    font-size: 28px;
    margin-bottom: 24px;
`

export const GrillaFavoritos = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: 20px;
`

export const MensajeVacio = styled.p`
    color: #555;
    font-size: 16px;
`

export const AvisoLogin = styled.p`
    color: #555;
    font-size: 16px;
`
