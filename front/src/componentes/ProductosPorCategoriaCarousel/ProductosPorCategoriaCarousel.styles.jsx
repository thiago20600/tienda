import { Link } from 'react-router-dom';
import styled from 'styled-components';

export const CategoriaBanner = styled.section`
  position: relative;
  width: min(1100px, calc(100% - 2rem));
  height: 170px;
  margin: 0.75rem auto 0.5rem;
  border-radius: 12px;
  overflow: hidden;
  background-color: #0f172a;
  color: #ffffff;
  font-family: 'Inter', 'Poppins', Arial, sans-serif;
`;

export const CategoriaBannerBg = styled.div`
  position: absolute;
  inset: 0;
  background-image: url(${(props) => props.$imagen});
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
`;

export const CategoriaBannerOverlay = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  padding: 2rem 3rem;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  gap: 0.5rem;
  background: linear-gradient(
    90deg,
    rgba(0, 0, 0, 0.6) 0%,
    rgba(0, 0, 0, 0.2) 100%
  );
`;

export const CategoriaBannerBreadcrumbs = styled.nav`
  font-size: 0.75rem;
  font-weight: 500;
  opacity: 0.8;
  letter-spacing: 0.02em;

  a {
    color: #ffffff;
    text-decoration: none;
    transition: opacity 160ms ease;

    &:hover {
      opacity: 0.6;
    }
  }

  span {
    margin: 0 0.4rem;
    opacity: 0.6;
  }
`;

export const CategoriaBannerTitle = styled.h1`
  margin: 0;
  font-size: 1.75rem;
  font-weight: 700;
  letter-spacing: 0.01em;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.4);
`;

export const CategoriaBannerLink = styled(Link)`
  flex: 0 0 auto;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.12);
  border: 1px solid rgba(255, 255, 255, 0.25);
  color: #ffffff;
  font-size: 0.95rem;
  font-weight: 600;
  text-decoration: none;
  backdrop-filter: blur(6px);
  transition: background 160ms ease, border-color 160ms ease, transform 160ms ease;

  &:hover {
    background: rgba(255, 255, 255, 0.22);
    border-color: #ffffff;
    transform: translateY(-1px);
  }

  &::after {
    content: '→';
    transition: transform 160ms ease;
  }

  &:hover::after {
    transform: translateX(3px);
  }
`;
