import styled from "styled-components";

export const ImageContainer = styled.div`

    width: 100%;

    display: flex;
    justify-content: center;
    align-items: center;

`

export const ProductImageElement = styled.img`

    width: 100%;

    max-width: 500px;

    height: auto;

    object-fit: contain;

    border-radius: 8px;

`

export const PlaceholderImage = styled.img`
    width: 250px;
    height: auto;
    object-fit: contain;
`;