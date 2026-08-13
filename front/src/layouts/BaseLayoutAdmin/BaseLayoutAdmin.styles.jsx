import styled from 'styled-components';

export const LayoutAdminContainer = styled.div`
  display: flex;
  width: 100%;
  min-height: 100vh;
  background-color: #f8f9fa; /* Fondo gris muy suave para el área de contenido */
`;

export const MainContent = styled.main`
  flex: 1; /* Ocupa todo el espacio restante a la derecha */
  display: flex;
  flex-direction: column;
  min-width: 0; /* Previene que el contenido desborde el flexbox */
  overflow-y: auto; /* Permite scroll solo en el contenido si es muy largo */
`;