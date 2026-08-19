import { useState, useEffect } from "react"
import { Outlet } from "react-router-dom"
import Navbar from "../../componentes/Navbar/Navbar";
import useDebounce from "../../../utils/useDebounce"

const BaseLayout = () => {

    const UrlApiBase = import.meta.env.VITE_API_URL
    const UrlApiBaseUsuarios = import.meta.env.VITE_API_URL_USUARIOS
    const [query, setQuery] = useState('')
    const [productos, setProductos] = useState([])
    const debounceValue = useDebounce(query, 500)
    
    const [userData, setUserData] = useState(null)

    /* obtener datos del usuario */
    const getMeUser = async () => {
        const access_token = localStorage.getItem('token')
        const response = await fetch(`${UrlApiBaseUsuarios}/users/me/`, {method:'GET',
                                                                        headers: {
                                                                                    'Authorization': `Bearer ${access_token}`,
                                                                                    'Content-Type': 'application/json'}
                                                                            }

        )

        if (response.ok) {
            const user_data = await response.json()
            return user_data
        }else{return null}

    }
    
    
    /* Buscador */
    useEffect(() => {

        const RealizarBusqueda = async () => {

            const respuesta = await fetch(
                `${UrlApiBase}/productos?q=${debounceValue}`
            )

            const data = await respuesta.json()

            setProductos(data.items)
        }

        RealizarBusqueda()

    }, [debounceValue])


    /* cargar datos del usuario */
    useEffect(() => {
        
        const token = localStorage.getItem('token')


        if (token){
            const cargarUsuario = async () => {
                const user = await getMeUser()
                setUserData(user)
                }
                cargarUsuario()
            }
    }, [])


    return (
        <>
            <Navbar setQuery={setQuery} usuario={userData}/>
            <Outlet context={{productos,query}}/>
        </>
    )
}

export default BaseLayout