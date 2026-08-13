import { useState } from "react"
import { useNavigate } from "react-router-dom"


export default function useEliminarProducto() {

    const navigate = useNavigate()
    const [message, setMessage] = useState('') 
    const accessToken = localStorage.getItem('token')
    const UrlApiBaseProductos = import.meta.env.VITE_API_URL

    if (!accessToken){
        setMessage('Sesion no valida')
        navigate('/login')
    }

    const eliminarProducto = async (id) => {
        
        const response = await fetch(`${UrlApiBaseProductos}/productos/${id}`,
            {
                method: 'DELETE',
                headers: {
                    'content-type': 'application/json',
                    'authorization': `Bearer ${accessToken}`
                }
            }
        )



        if (!response.ok){
            setMessage(response.status)
        }else{
            const data = await response.json()
            setMessage(data.detail)
        }


    }

    return {eliminarProducto, message}

}