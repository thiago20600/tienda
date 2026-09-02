import { Navigate, Outlet } from 'react-router-dom';
import { getSession } from '../services/auth/session';

const RutaProtegida = ({ permisoRequerido }) => {
  const session = getSession();

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  const permisos = session.permisos || [];

  if (permisoRequerido) {
    const tienePermiso = permisoRequerido === 'admin'
      ? permisos.some((p) => p.endsWith(':admin'))
      : permisos.includes(permisoRequerido);

    if (!tienePermiso) {
      return <Navigate to="/" replace />;
    }
  }

  return <Outlet />;
};

export default RutaProtegida;