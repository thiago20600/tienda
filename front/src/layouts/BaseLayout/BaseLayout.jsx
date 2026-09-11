import { useState } from "react"
import { Outlet } from "react-router-dom"
import Navbar from "../../componentes/Navbar/Navbar";
import { useAuth } from "../../services/auth/useAuth";
import { FavoritosProvider } from "../../services/favoritos/FavoritosContext";

const BaseLayout = () => {

    const [query, setQuery] = useState('')
    const { usuario } = useAuth()


    return (
        <FavoritosProvider>
            <Navbar setQuery={setQuery} usuario={usuario}/>
            <Outlet context={{query}}/>
        </FavoritosProvider>
    )
}

export default BaseLayout