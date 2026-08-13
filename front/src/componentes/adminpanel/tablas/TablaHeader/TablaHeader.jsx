import { useState } from 'react';
import { TablaHeaderContainer, FiltrosList, FiltroItem, FiltroBoton, EliminarFiltroBoton } from './TablaHeader.styles';

const TablaHeader = ({ onSortChange, areasFiltrar = [] }) => {
  // Estado para saber qué campo se está ordenando y en qué dirección
  const [sortConfig, setSortConfig] = useState({ campo: null, direccion: 'asc' });

  const handleSort = (campo) => {
    let nuevaDireccion = 'asc';

    // Si vuelven a hacer clic en el mismo campo, invertimos el orden
    if (sortConfig.campo === campo && sortConfig.direccion === 'asc') {
      nuevaDireccion = 'desc';
    }

    const nuevoEstado = { campo, direccion: nuevaDireccion };
    setSortConfig(nuevoEstado);

    if (onSortChange) {
      onSortChange(nuevoEstado);
    }
  };

  // Función para limpiar/resetear el ordenamiento aplicado
  const handleResetFilters = () => {
    const estadoLimpio = { campo: null, direccion: 'asc' };
    setSortConfig(estadoLimpio);

    if (onSortChange) {
      onSortChange(estadoLimpio);
    }
  };

  return (
    <TablaHeaderContainer>
      <FiltrosList>
        {areasFiltrar.map((atributo) => {
          const isActive = sortConfig.campo === atributo.key;
          const flecha = isActive ? (sortConfig.direccion === 'asc' ? ' ↑' : ' ↓') : '';

          return (
            <FiltroItem key={atributo.key}>
              <FiltroBoton $active={isActive} onClick={() => handleSort(atributo.key)}>
                {atributo.label} {flecha}
              </FiltroBoton>
            </FiltroItem>
          );
        })}
      </FiltrosList>

      {sortConfig.campo && (
        <EliminarFiltroBoton onClick={handleResetFilters}>
          Limpiar filtros ✕
        </EliminarFiltroBoton>
      )}
    </TablaHeaderContainer>
  );
};

export default TablaHeader;