import { Navigate, Outlet } from 'react-router-dom';
import { getSession } from '../services/auth/session';

const RutaProtegida = ({ rolRequerido }) => {
  const session = getSession();

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  if (rolRequerido && session.rol !== rolRequerido) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default RutaProtegida;