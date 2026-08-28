import { useState } from "react"
import { Outlet } from "react-router-dom"
import Navbar from "../../componentes/Navbar/Navbar";
import { useAuth } from "../../services/auth/useAuth";

const BaseLayout = () => {

    const [query, setQuery] = useState('')
    const { usuario } = useAuth()


    return (
        <>
            <Navbar setQuery={setQuery} usuario={usuario}/>
            <Outlet context={{query}}/>
        </>
    )
}

export default BaseLayout