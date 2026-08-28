import { PaginadorContainer, BotonPagina, InfoPagina } from './CambiarPagina.styles'

const CambiarPagina = ({paginaActual, totalPaginas, onPageChange, textoAnterior = 'Anterior', textoSiguiente = 'Siguiente'}) => {

  if (totalPaginas <= 1) return null;

  const handleAnterior = () => {
    if (paginaActual > 1) onPageChange(paginaActual - 1);
  };

  const handleSiguiente = () => {
    if (paginaActual < totalPaginas) onPageChange(paginaActual + 1);
  };

  return (
    <PaginadorContainer>
      <BotonPagina type="button" onClick={handleAnterior} disabled={paginaActual === 1}>
        {textoAnterior}
      </BotonPagina>
      <InfoPagina>
        Página {paginaActual} de {totalPaginas}
      </InfoPagina>
      <BotonPagina type="button" onClick={handleSiguiente} disabled={paginaActual === totalPaginas}>
        {textoSiguiente}
      </BotonPagina>
    </PaginadorContainer>
  );
};

export default CambiarPagina;