import { NavbarContainer } from './Navbar.styles'
import { GrupoLinks } from './Navbar.styles'
import { Marca } from './Navbar.styles'
import SearchBar from '../SearchBar/SearchBar'
import { DesplegableUsuario } from '../DesplegableUsuario/DesplegableUsuario'
import { NavLink } from 'react-router-dom'
import CategoryMenu from './CategoryMenu'
import useConfiguracion from '../../hooks/configuracion/useConfiguracion'

const Navbar = ({ usuario, setQuery }) => {
    const { configuracion } = useConfiguracion()

    return (

        <NavbarContainer>

            <GrupoLinks>

                <Marca to="/">
                    {configuracion?.logo_url && <img src={configuracion.logo_url} alt={configuracion.nombre_tienda} />}
                    {configuracion?.nombre_tienda || 'Inicio'}
                </Marca>
                <CategoryMenu />

            </GrupoLinks>

            <GrupoLinks>

                <SearchBar setQuery={setQuery} />

                {!usuario && (
                    <>
                        <NavLink to="/login">Login</NavLink>
                        <NavLink to="/register">Registrarse</NavLink>
                    </>
                )}

                <NavLink to="/carrito">Carrito</NavLink>
                {usuario && <NavLink to="/mis-pedidos">Mis pedidos</NavLink>}
                {usuario && <NavLink to="/favoritos">Favoritos</NavLink>}

                {usuario && (
                    <DesplegableUsuario usuario={usuario}></DesplegableUsuario>
                )}

            </GrupoLinks>

        </NavbarContainer>

    )

}

export default Navbar