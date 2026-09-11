import useCategorias from '../../../hooks/categorias/useCategorias';
import {
  FiltrosProductosContainer,
  FiltroGrupo,
  FiltroLabel,
  FiltroInput,
  FiltroSelect
} from './FiltrosProductosAdmin.styles';

const FiltrosProductosAdmin = ({ filtros, onFiltroChange }) => {
  const { categorias } = useCategorias();

  return (
    <FiltrosProductosContainer>
      <FiltroGrupo>
        <FiltroLabel htmlFor="producto-busqueda">Buscar por nombre</FiltroLabel>
        <FiltroInput
          id="producto-busqueda"
          value={filtros.q}
          onChange={(event) => onFiltroChange('q', event.target.value)}
          placeholder="Nombre del producto"
        />
      </FiltroGrupo>
      <FiltroGrupo>
        <FiltroLabel htmlFor="producto-categoria">Categoría</FiltroLabel>
        <FiltroSelect
          id="producto-categoria"
          value={filtros.categoriaId}
          onChange={(event) => onFiltroChange('categoriaId', event.target.value)}
        >
          <option value="">Todas</option>
          {categorias.filter((categoria) => categoria.estado).map((categoria) => (
            <option key={categoria.id} value={categoria.id}>{categoria.nombre}</option>
          ))}
        </FiltroSelect>
      </FiltroGrupo>
      <FiltroGrupo>
        <FiltroLabel htmlFor="producto-estado">Estado</FiltroLabel>
        <FiltroSelect
          id="producto-estado"
          value={filtros.estado}
          onChange={(event) => onFiltroChange('estado', event.target.value)}
        >
          <option value="">Todos</option>
          <option value="true">Activos</option>
          <option value="false">Inactivos</option>
        </FiltroSelect>
      </FiltroGrupo>
      <FiltroGrupo>
        <FiltroLabel htmlFor="producto-ofertas">Tipo</FiltroLabel>
        <FiltroSelect
          id="producto-ofertas"
          value={filtros.tipo || ''}
          onChange={(event) => onFiltroChange('tipo', event.target.value)}
        >
          <option value="">Todos</option>
          <option value="ofertas">En oferta</option>
          <option value="destacados">Destacados</option>
        </FiltroSelect>
      </FiltroGrupo>
    </FiltrosProductosContainer>
  );
};

export default FiltrosProductosAdmin;
