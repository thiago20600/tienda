import styled from 'styled-components';

export const LayoutAdminContainer = styled.div`
  display: flex;
  width: 100%;
  min-height: 100vh;
  background-color: #f8f9fa;
  font-family: 'Inter', 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;

  @media (max-width: 800px) {
    flex-direction: column;
  }
`;

export const MainContent = styled.main`
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
  overflow-y: auto;
  background-color: #f8f9fa;
`;