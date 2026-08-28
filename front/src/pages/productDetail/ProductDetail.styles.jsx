import styled from "styled-components"

export const ProductDetailStyle = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(280px, 360px);
  gap: 2rem;
  width: min(1180px, 100%);
  margin: 0 auto;
  padding: 3rem 2rem;
  box-sizing: border-box;
  align-items: center;

  @media (max-width: 800px) {
    grid-template-columns: 1fr;
    max-width: 680px;
    padding: 2rem 1rem;
  }
`;


export const ProductDetailWrapper = styled.div`
  width: 100%;
  min-height: 100vh;
  background: #f1f5f9;
  box-sizing: border-box;
`;