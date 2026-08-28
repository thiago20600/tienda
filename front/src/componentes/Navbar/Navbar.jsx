import { NavbarContainer } from './Navbar.styles'
import { GrupoLinks } from './Navbar.styles'
import SearchBar from '../SearchBar/SearchBar'
import { DesplegableUsuario } from '../DesplegableUsuario/DesplegableUsuario'
import { NavLink } from 'react-router-dom'
import CategoryMenu from './CategoryMenu'

const Navbar = ({ usuario, setQuery }) => {
    
    return (

        <NavbarContainer>

            <GrupoLinks>

                <NavLink to="/">Inicio</NavLink>
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

                {usuario && (
                    <DesplegableUsuario usuario={usuario}></DesplegableUsuario>
                )}

            </GrupoLinks>

        </NavbarContainer>

    )

}

export default Navbar