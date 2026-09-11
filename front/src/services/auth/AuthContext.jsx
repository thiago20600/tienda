import { useEffect, useState } from 'react';
import { usuariosRequest } from '../api/apiClient';
import { clearSession, guardarSesionDesdeToken, getSession } from './session';
import AuthContext from './authContext';

export const AuthProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(true);

  const cargarUsuario = async () => {
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
    guardarSesionDesdeToken(token);
    await cargarUsuario();
  };

  const logout = async () => {
    try {
      await usuariosRequest('/logout', { method: 'POST', auth: true });
    } catch {
      // si el servicio de usuarios no responde, la cookie local expira sola
    }
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

