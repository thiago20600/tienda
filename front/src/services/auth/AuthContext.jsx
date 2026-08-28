import { useEffect, useState } from 'react';
import { usuariosRequest } from '../api/apiClient';
import { clearSession, getAccessToken, getSession } from './session';
import AuthContext from './authContext';

export const AuthProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(true);

  const cargarUsuario = async () => {
    if (!getAccessToken()) {
      setUsuario(null);
      setCargando(false);
      return;
    }

    try {
      const response = await usuariosRequest('/users/me/', { auth: true });
      if (!response.ok) {
        clearSession();
        setUsuario(null);
        return;
      }
      const userData = await response.json();
      const session = getSession();
      setUsuario({ ...userData, rol: userData.rol || session?.rol });
    } catch (error) {
      console.error('Error cargando usuario:', error);
      setUsuario(null);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    // La sesión se sincroniza una vez con el usuario persistido.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void cargarUsuario();

    const handleSessionExpired = () => {
      clearSession();
      setUsuario(null);
    };

    window.addEventListener('auth:expired', handleSessionExpired);
    return () => window.removeEventListener('auth:expired', handleSessionExpired);
  }, []);

  const login = async (token) => {
    localStorage.setItem('token', token);
    await cargarUsuario();
  };

  const logout = () => {
    clearSession();
    setUsuario(null);
  };

  const actualizarUsuario = (datos) => {
    setUsuario((actual) => ({ ...actual, ...datos }));
  };

  return (
    <AuthContext.Provider value={{ usuario, cargando, login, logout, actualizarUsuario }}>
      {children}
    </AuthContext.Provider>
  );
};

