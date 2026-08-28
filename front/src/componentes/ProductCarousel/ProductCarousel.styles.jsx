import styled from 'styled-components';

export const CarouselContainer = styled.div`
    position: relative;
    width: 100%;
    max-width: 500px;
    aspect-ratio: 4 / 3;
    margin: 0 auto;
    overflow: hidden;
    border-radius: 10px;
    background: white;
`;

export const CarouselTrack = styled.div`
    display: flex;
    width: 100%;
    height: 100%;
    transform: translateX(${(props) => props.$indice * -100}%);
    transition: transform 460ms cubic-bezier(0.22, 1, 0.36, 1);

    @media (prefers-reduced-motion: reduce) {
        transition: none;
    }
`;

export const CarouselImage = styled.img`
    display: block;
    flex: 0 0 100%;
    width: 100%;
    height: 100%;
    object-fit: contain;
`;

export const CarouselButton = styled.button`
    position: absolute;
    top: 50%;
    ${(props) => props.$left ? 'left: 0.75rem;' : 'right: 0.75rem;'}
    transform: translateY(-50%);
    display: grid;
    place-items: center;
    width: 2.5rem;
    height: 2.5rem;
    padding: 0;
    border: 1px solid rgba(255, 255, 255, 0.65);
    border-radius: 50%;
    background: rgba(15, 23, 42, 0.72);
    color: transparent;
    box-shadow: 0 4px 14px rgba(15, 23, 42, 0.2);
    cursor: pointer;
    z-index: 1;
    transition: background 180ms ease, transform 180ms ease, box-shadow 180ms ease;

    &::before {
        content: '';
        width: 0.55rem;
        height: 0.55rem;
        border-right: 2px solid #fff;
        border-bottom: 2px solid #fff;
        transform: ${(props) => props.$left ? 'rotate(135deg)' : 'rotate(-45deg)'};
    }

    &:hover {
        background: #009ee3;
        box-shadow: 0 6px 16px rgba(0, 158, 227, 0.3);
        transform: translateY(-50%) scale(1.06);
    }

    &:focus-visible {
        outline: 3px solid rgba(0, 158, 227, 0.35);
        outline-offset: 3px;
    }
`;

export const DotsContainer = styled.div`
    position: absolute;
    left: 50%;
    bottom: 0.75rem;
    display: flex;
    gap: 0.45rem;
    transform: translateX(-50%);
`;

export const Dot = styled.button`
    width: 0.55rem;
    height: 0.55rem;
    padding: 0;
    border: 0;
    border-radius: 50%;
    background: ${(props) => props.$activo ? '#009ee3' : 'rgba(15, 23, 42, 0.35)'};
    cursor: pointer;
`;
