import { SideBarContainer, SideBarBrand, BrandLogo, BrandName, ListaSeccionContainer, SeccionItem, SeccionLink } from "./SideBar.styles"
import { getSession } from "../../../services/auth/session"

const SideBar = () => {

    const sideBarSecciones = [
        {name: 'Inicio', path: '/admin', permisos: []},
        {name: 'Pedidos', path: '/admin/pedidos', permisos: ['pedidos:read:admin']},
        {name: 'Categorias', path: '/admin/categorias', permisos: ['categorias:read:admin', 'categorias:create:admin', 'categorias:update:admin', 'categorias:delete:admin']},
        {name: 'Productos', path: '/admin/productos', permisos: ['productos:read:admin']},
        {name: 'Banners', path: '/admin/banners', permisos: ['banners:read:admin']},
        {name: 'Usuarios', path: '/admin/usuarios', permisos: ['usuarios:read:admin']},
        {name: 'Roles y permisos', path: '/admin/roles', permisos: ['roles:read:admin']},
        {name: 'Configuracion', path: '/admin/configuracion', permisos: []}
    ]

    const session = getSession()
    const permisos = session?.permisos || []

    // Las secciones con "permisos: []" (Inicio, Configuracion) son visibles
    // para cualquier usuario que ya tenga acceso al panel (algún permiso :admin).
    // El resto solo se muestra si el usuario tiene ALGUNO de los permisos de la sección.
    const seccionesVisibles = sideBarSecciones.filter((seccion) =>
        seccion.permisos.length === 0 || seccion.permisos.some((permiso) => permisos.includes(permiso))
    )

    return (
        <SideBarContainer>
            <SideBarBrand>
                <BrandLogo>A</BrandLogo>
                <BrandName>Admin</BrandName>
            </SideBarBrand>
            <ListaSeccionContainer>
                {seccionesVisibles.map((seccion) => (
                    <SeccionItem key={seccion.name}>
                        <SeccionLink to={seccion.path} end={seccion.path === '/admin' || seccion.path === '/'}><strong>
                            {seccion.name}
                        </strong></SeccionLink>
                    </SeccionItem>
                ))}
            </ListaSeccionContainer>
        </SideBarContainer>
    )

}

export default SideBar