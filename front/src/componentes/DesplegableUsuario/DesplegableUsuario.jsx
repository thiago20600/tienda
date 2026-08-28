import { useState } from "react";
import { MenuContainer, UserButton, DropdownNav, MenuLink } from "./DesplegableUsuario.styles";
import { useAuth } from "../../services/auth/useAuth";

export const DesplegableUsuario = ({ usuario }) => {
  const [botonActivo, setBotonActivo] = useState(false)
  const { logout } = useAuth()
  const userRole = usuario?.rol;

  const seleccionables = [
    { id: 'configuracion', nombre: 'Configuracion', acceso: 'publico', link: '/configuracion' },
    { id: 'cerrarSesion', nombre: 'Cerrar sesion', acceso: 'publico', link: '/' },
    { id: 'admin', nombre: 'Admin', acceso: 'privado', link: '/admin' },
  ];

  const itemsFiltrados = seleccionables.filter(item => {
    if (item.acceso === 'publico') return true; // Siempre mostrar públicos
    if (item.acceso === 'privado' && userRole === 'admin') return true; // Solo admin ve privados
    return false;
  });

  const handleLogout = () => {
    logout();
    };




  return (
    <MenuContainer>
            <UserButton onClick={() => {setBotonActivo(!botonActivo)}}>{usuario.username}</UserButton>
        {botonActivo && (
            <DropdownNav>
                {itemsFiltrados.map((seleccionable) => {
                return (
                    <MenuLink key={seleccionable.id} to={seleccionable.link} 
                    onClick={seleccionable.id === 'cerrarSesion' ? handleLogout : null}>
                    {seleccionable.nombre}
                    </MenuLink>
                )
                })}
            </DropdownNav>)
        }
    </MenuContainer>
  )
}


/*
    return(
        <BotonUsuario> button ->
            <ListaUsuario> -> ul
                <OpcionUsuario> -> li, navlink
                <OpcionUsuario/>
            <ListaUsuario/>
        <BotonUsuario>
    )


*/