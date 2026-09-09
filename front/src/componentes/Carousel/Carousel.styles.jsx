import styled from 'styled-components';
import { Link } from 'react-router-dom';

export const CarouselContainer = styled.section`
  position: relative;
  width: min(1100px, calc(100% - 2rem));
  margin: 1.25rem auto 0;
`;

export const SeccionTitulo = styled.h3`
  margin: 0 0 0.75rem;
  color: #1e293b;
  font-size: 1.15rem;
  font-weight: 700;
  text-decoration: none;

  &:hover {
    color: #009ee3;
  }
`;

export const CarouselArrowsWrapper = styled.div`
  position: relative;
`;

export const Viewport = styled.div`
  overflow: hidden;
`;

export const Track = styled.div`
  display: flex;
  transition: transform 420ms cubic-bezier(0.22, 1, 0.36, 1);

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;

export const Slide = styled.div`
  flex: 0 0 calc(
    (100% - ${(props) => (props.$itemsVisibles - 1) * props.$gapPx}px) /
      ${(props) => props.$itemsVisibles}
  );
  min-width: 0;

  @media (max-width: 900px) {
    flex: 0 0 calc((100% - 24px) / 3);
  }

  @media (max-width: 560px) {
    flex: 0 0 calc((100% - 12px) / 2);
  }
`;

export const Flecha = styled.button`
  position: absolute;
  top: 50%;
  ${(props) => (props.$left ? 'left: -14px;' : 'right: -14px;')}
  transform: translateY(-50%);
  display: grid;
  place-items: center;
  width: 2.2rem;
  height: 2.2rem;
  padding: 0;
  border: 1px solid #e2e8f0;
  border-radius: 50%;
  background: #ffffff;
  box-shadow: 0 4px 12px rgba(15, 23, 42, 0.12);
  cursor: pointer;
  z-index: 1;
  transition: background 160ms ease, transform 160ms ease, opacity 160ms ease;

  &::before {
    content: '';
    width: 0.5rem;
    height: 0.5rem;
    border-right: 2px solid #334155;
    border-bottom: 2px solid #334155;
    transform: ${(props) => (props.$left ? 'rotate(135deg)' : 'rotate(-45deg)')};
  }

  &:hover:not(:disabled) {
    background: #009ee3;
    transform: translateY(-50%) scale(1.08);

    &::before {
      border-color: #ffffff;
    }
  }

  &:disabled {
    opacity: 0.35;
    cursor: default;
  }
`;

export const Dots = styled.div`
  display: flex;
  justify-content: center;
  gap: 0.4rem;
  margin-top: 0.9rem;
`;

export const Dot = styled.button`
  width: 0.5rem;
  height: 0.5rem;
  padding: 0;
  border: 0;
  border-radius: 50%;
  background: ${(props) => (props.$activo ? '#009ee3' : '#cbd5e1')};
  cursor: pointer;
  transition: transform 150ms ease, background 150ms ease;

  &:hover {
    transform: scale(1.3);
  }
`;

export const Mensaje = styled.p`
  color: #64748b;
  font-size: 0.9rem;
`;
