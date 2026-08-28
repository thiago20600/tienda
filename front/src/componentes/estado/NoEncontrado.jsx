import { EstadoContainer, EstadoLink } from './NoEncontrado.styles';

const NoEncontrado = () => (
  <EstadoContainer>
    <span>404</span>
    <h1>Página no encontrada</h1>
    <p>La dirección que buscás no existe o fue movida.</p>
    <EstadoLink to="/">Volver al inicio</EstadoLink>
  </EstadoContainer>
);

export default NoEncontrado;
