import { Link } from 'react-router-dom';
import styled from 'styled-components';

export const BannerCarouselContainer = styled.section`
  position: relative;
  width: min(1100px, calc(100% - 2rem));
  aspect-ratio: 21 / 8;
  margin: 1.5rem auto 0;
  border-radius: 14px;
  overflow: hidden;
  background: #0f172a;
  box-shadow: 0 12px 30px rgba(15, 23, 42, 0.18);

  @media (max-width: 640px) {
    aspect-ratio: 16 / 10;
    margin-top: 1rem;
  }
`;

export const BannerTrack = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  transform: translateX(${(props) => props.$indice * -100}%);
  transition: transform 520ms cubic-bezier(0.22, 1, 0.36, 1);

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;

export const BannerSlide = styled.div`
  position: relative;
  flex: 0 0 100%;
  width: 100%;
  height: 100%;
`;

export const BannerImagen = styled.img`
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

export const BannerOverlay = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-end;
  gap: 0.9rem;
  padding: 2rem;
  background: linear-gradient(
    to top,
    rgba(15, 23, 42, 0.72) 0%,
    rgba(15, 23, 42, 0.28) 45%,
    rgba(15, 23, 42, 0) 75%
  );

  @media (max-width: 640px) {
    padding: 1.1rem;
    gap: 0.6rem;
  }
`;

export const BannerTitulo = styled.h2`
  margin: 0;
  color: #ffffff;
  font-size: clamp(1.2rem, 3vw, 2rem);
  font-weight: 700;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.4);
  max-width: 80%;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
`;

export const BannerBoton = styled(Link)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.6rem 1.4rem;
  border-radius: 999px;
  background: ${(props) => props.$color || '#009ee3'};
  color: #ffffff;
  font-size: 0.95rem;
  font-weight: 700;
  text-decoration: none;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.25);
  transition: transform 180ms ease, filter 180ms ease;

  &:hover {
    filter: brightness(1.08);
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
  }
`;

export const BannerFlecha = styled.button`
  position: absolute;
  top: 50%;
  ${(props) => (props.$left ? 'left: 0.9rem;' : 'right: 0.9rem;')}
  transform: translateY(-50%);
  display: grid;
  place-items: center;
  width: 2.6rem;
  height: 2.6rem;
  padding: 0;
  border: 1px solid rgba(255, 255, 255, 0.6);
  border-radius: 50%;
  background: rgba(15, 23, 42, 0.55);
  backdrop-filter: blur(4px);
  cursor: pointer;
  z-index: 1;
  transition: background 180ms ease, transform 180ms ease;

  &::before {
    content: '';
    width: 0.6rem;
    height: 0.6rem;
    border-right: 2px solid #ffffff;
    border-bottom: 2px solid #ffffff;
    transform: ${(props) => (props.$left ? 'rotate(135deg)' : 'rotate(-45deg)')};
  }

  &:hover {
    background: #009ee3;
    transform: translateY(-50%) scale(1.08);
  }

  &:focus-visible {
    outline: 3px solid rgba(0, 158, 227, 0.4);
    outline-offset: 2px;
  }
`;

export const BannerDots = styled.div`
  position: absolute;
  left: 50%;
  bottom: 0.9rem;
  display: flex;
  gap: 0.45rem;
  transform: translateX(-50%);
  z-index: 1;
`;

export const BannerDot = styled.button`
  width: 0.6rem;
  height: 0.6rem;
  padding: 0;
  border: 0;
  border-radius: 50%;
  background: ${(props) => (props.$activo ? '#009ee3' : 'rgba(255, 255, 255, 0.55)')};
  cursor: pointer;
  transition: transform 150ms ease, background 150ms ease;

  &:hover {
    transform: scale(1.25);
  }
`;

export const BannerMensaje = styled.p`
  width: min(1100px, calc(100% - 2rem));
  margin: 1.5rem auto 0;
  color: #64748b;
  font-size: 0.9rem;
  text-align: center;
`;