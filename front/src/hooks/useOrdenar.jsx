import { useMemo } from 'react';

export default function useOrdenamiento(listaInicial = [], sortConfig = { campo: null, direccion: 'asc' }) {
  
  const datosOrdenados = useMemo(() => {
    // 1. Si no hay ningún campo seleccionado para ordenar, devolvemos la lista original
    if (!sortConfig || !sortConfig.campo) {
      return listaInicial;
    }

    // 2. Hacemos una copia ([...listaInicial]) para no alterar el array original
    return [...listaInicial].sort((a, b) => {
      let valA = a[sortConfig.campo] ?? '';
      let valB = b[sortConfig.campo] ?? '';

      // Si son strings (textos como el nombre), pasamos a minúsculas para comparar bien
      if (typeof valA === 'string') valA = valA.toLowerCase();
      if (typeof valB === 'string') valB = valB.toLowerCase();

      if (valA < valB) return sortConfig.direccion === 'asc' ? -1 : 1;
      if (valA > valB) return sortConfig.direccion === 'asc' ? 1 : -1;
      return 0;
    });
  }, [listaInicial, sortConfig]); // 
  return { datosOrdenados };
}