import { Navigate, Outlet } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; // npm install jwt-decode

const RutaProtegida = ({ rolRequerido }) => {
  const token = localStorage.getItem('token');

  // 1. Si ni siquiera hay token, lo mandamos al Login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  try {
    // 2. Decodificamos el token para leer el rol
    const decodedToken = jwtDecode(token);
    const userRole = decodedToken.rol; // Depende cómo lo devuelvas en tu payload de JWT

    // Optional: Validar si el token ya expiró
    if (decodedToken.exp * 1000 < Date.now()) {
      localStorage.removeItem('token');
      return <Navigate to="/login" replace />;
    }

    // 3. Validar si el usuario tiene el rol necesario
    if (rolRequerido && userRole !== rolRequerido) {
      // Si está logueado pero NO es Admin, lo mandamos al inicio o pantalla de no autorizado
      return <Navigate to="/" replace />;
    }

    // Si pasa todas las validaciones, renderiza las rutas hijas
    return <Outlet />;

  } catch (error) {
    // Si el token es inválido/corrupto, limpiamos y redirigimos
    localStorage.removeItem('token');
    return <Navigate to="/login" replace />;
  }
};

export default RutaProtegida;