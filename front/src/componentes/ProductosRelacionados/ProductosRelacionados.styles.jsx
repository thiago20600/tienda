import styled from "styled-components";

export const SeccionRelacionados = styled.section`
  width: min(1180px, 100%);
  margin: 0 auto;
  padding: 0 2rem 3rem;
  box-sizing: border-box;
`;

export const TituloRelacionados = styled.h2`
  font-size: 1.4rem;
  margin: 0 0 1.25rem;
  color: #0f172a;
`;

export const GrillaRelacionados = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 1.25rem;

  @media (max-width: 1000px) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  @media (max-width: 720px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
`;
