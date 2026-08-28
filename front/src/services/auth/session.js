import { jwtDecode } from 'jwt-decode';

export const getAccessToken = () => localStorage.getItem('token');

export const clearSession = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('usuario');
};

export const getSession = () => {
  const token = getAccessToken();
  if (!token) return null;

  try {
    const payload = jwtDecode(token);
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
