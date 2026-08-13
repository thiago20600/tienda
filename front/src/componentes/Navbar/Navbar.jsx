import { NavbarContainer } from './Navbar.styles'
import { GrupoLinks } from './Navbar.styles'
import SearchBar from '../SearchBar/SearchBar'

const Navbar = ({ usuario, setQuery }) => {
    
    return (

        <NavbarContainer>

            <GrupoLinks>

                <a href="/">Inicio</a>
                <a href="/categorias">Categorías</a>

            </GrupoLinks>

            <GrupoLinks>

                <SearchBar setQuery={setQuery} />

                {!usuario && (
                    <>
                        <a href="/login">Login</a>
                        <a href="/registrarse">Registrarse</a>
                    </>
                )}

                <a href="/carrito">Carrito</a>

                {usuario && (
                    <button>{usuario.username}</button>
                )}

            </GrupoLinks>

        </NavbarContainer>

    )

}

export default Navbar