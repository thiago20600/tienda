import { jwtDecode } from 'jwt-decode';

const CLAVE_SESION = 'sesion';

export const getAccessToken = () => null;

export const clearSession = () => {
  localStorage.removeItem(CLAVE_SESION);
  localStorage.removeItem('usuario');
  localStorage.removeItem('token');
};

export const guardarSesionDesdeToken = (token) => {
  const payload = jwtDecode(token);
  if (!payload.exp || payload.exp * 1000 <= Date.now()) {
    throw new Error('Token expirado');
  }
  localStorage.setItem(CLAVE_SESION, JSON.stringify(payload));
  return payload;
};

export const getSession = () => {
  const cruda = localStorage.getItem(CLAVE_SESION);
  if (!cruda) {
    localStorage.removeItem('token');
    return null;
  }

  try {
    const payload = JSON.parse(cruda);
    if (!payload.exp || payload.exp * 1000 <= Date.now()) {
      clearSession();
      return null;
    }
    return payload;
  } catch {
    clearSession();
    return null;
  }
};
