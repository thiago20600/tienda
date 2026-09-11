import { useState } from "react";
import { MenuContainer, UserButton, DropdownNav, MenuLink } from "./DesplegableUsuario.styles";
import { useAuth } from "../../services/auth/useAuth";
import { getSession } from "../../services/auth/session";

export const DesplegableUsuario = ({ usuario }) => {
  const [botonActivo, setBotonActivo] = useState(false);
  const { logout } = useAuth();
  const session = getSession();
  const userPermisos = session?.permisos || [];

  const seleccionables = [
    { id: 'configuracion', nombre: 'Configuracion', acceso: 'publico', link: '/configuracion' },
    { id: 'misPedidos', nombre: 'Mis pedidos', acceso: 'publico', link: '/mis-pedidos' },
    { id: 'favoritos', nombre: 'Favoritos', acceso: 'publico', link: '/favoritos' },
    { id: 'cerrarSesion', nombre: 'Cerrar sesion', acceso: 'publico', link: '/' },
    { id: 'admin', nombre: 'Admin', acceso: 'privado', link: '/admin' },
  ];

  const itemsFiltrados = seleccionables.filter(item => {
    if (item.acceso === 'publico') return true;
    if (item.acceso === 'privado' && userPermisos.some(p => p.endsWith(':admin'))) return true;
    return false;
  });

  const handleLogout = () => {
    logout();
  };

  return (
    <MenuContainer>
      <UserButton onClick={() => setBotonActivo(!botonActivo)}>
        {usuario?.username || 'Usuario'}
      </UserButton>

      {botonActivo && (
        <DropdownNav>
          {itemsFiltrados.map((seleccionable) => (
            <MenuLink
              key={seleccionable.id}
              to={seleccionable.link}
              onClick={seleccionable.id === 'cerrarSesion' ? handleLogout : null}
            > {seleccionable.nombre}
            </MenuLink>
          ))}
        </DropdownNav>
      )}
    </MenuContainer>
  );
};
