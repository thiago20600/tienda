import { useEffect, useState } from 'react';
import { usuariosRequest } from '../../services/api/apiClient';

const useUsuariosAdmin = ({ q = '', rol = '', tipo = '', page = 1, size = 10 } = {}) => {
  const [usuarios, setUsuarios] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [statusError, setStatusError] = useState(null);
  const [paginaActual, setPaginaActual] = useState(page);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [totalUsuarios, setTotalUsuarios] = useState(0);

  const cargarUsuarios = async () => {
    setCargando(true);
    try {
      const query = new URLSearchParams({
        page: String(paginaActual),
        size: String(size),
      });

      if (q) query.set('q', q);
      if (rol) query.set('rol', rol);
      if (tipo) query.set('tipo', tipo);

      const response = await usuariosRequest(`/users?${query.toString()}`, { auth: true });
      const data = await response.json().catch(() => ({ items: [], total: 0, page: 1, size, pages: 1 }));

      if (!response.ok) {
        setStatusError(response.status);
        return;
      }

      setUsuarios(data.items || []);
      setTotalPaginas(data.pages || 1);
      setTotalUsuarios(data.total || 0);
      setPaginaActual(data.page || paginaActual);
      setStatusError(null);
    } catch (error) {
      console.error('Error cargando usuarios:', error);
      setStatusError(0);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarUsuarios();
  }, [q, rol, tipo, paginaActual, size]);

  const cambiarPagina = (nuevaPagina) => {
    if (nuevaPagina >= 1 && nuevaPagina <= totalPaginas) {
      setPaginaActual(nuevaPagina);
    }
  };

  return { usuarios, cargando, statusError, page: paginaActual, pages: totalPaginas, total: totalUsuarios, cambiarPagina, recargar: cargarUsuarios };
};

export default useUsuariosAdmin;
