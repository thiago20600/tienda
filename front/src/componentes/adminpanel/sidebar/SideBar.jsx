import { SideBarContainer, ListaSeccionContainer, SeccionItem, SeccionLink } from "./SideBar.styles"

const SideBar = () => {

    const sideBarSecciones = [
        {name: 'Inicio', path: '/admin'}, 
        {name: 'Pedidos', path: '/admin/pedidos'},
        {name: 'Categorias', path: '/admin/categorias'}, 
        {name: 'Productos', path: '/admin/productos'}, 
        {name: 'Usuarios', path: '/admin/usuarios'},
        {name: 'Configuracion', path: '/admin/configuracion'}]


    return (
        <SideBarContainer>
            <ListaSeccionContainer>
                {sideBarSecciones.map((seccion) => (
                    <SeccionItem key={seccion.name}>
                        <SeccionLink to={seccion.path} end={seccion.path === '/admin' || seccion.path === '/'}>
                            {seccion.name}
                        </SeccionLink>
                    </SeccionItem>
                ))}
            </ListaSeccionContainer>
        </SideBarContainer>
    )

}

export default SideBar