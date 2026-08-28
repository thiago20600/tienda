import { useEffect, useState } from 'react';
import { usuariosRequest } from '../../services/api/apiClient';

const useUsuariosAdmin = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [statusError, setStatusError] = useState(null);

  useEffect(() => {
    const cargarUsuarios = async () => {
      try {
        const response = await usuariosRequest('/users', { auth: true });
        const data = await response.json().catch(() => []);
        if (!response.ok) {
          setStatusError(response.status);
          return;
        }
        setUsuarios(data);
        setStatusError(null);
      } catch (error) {
        console.error('Error cargando usuarios:', error);
        setStatusError(0);
      } finally {
        setCargando(false);
      }
    };

    cargarUsuarios();
  }, []);

  return { usuarios, cargando, statusError };
};

export default useUsuariosAdmin;
