import { useState } from "react"

export default function useEliminarCategoria () {

    const accessToken = localStorage.getItem('token')
    const UrlApiBaseProductos = import.meta.env.VITE_API_URL
    const [statusError, setStatusError] = useState(null)


    const eliminarCategoria = async (id) => {
        

        try{
            response = await fetch(`${UrlApiBaseProductos}/categorias/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                }
            })

            if (!response.ok){
                setStatusError(response.status)
            }

            const data = await response.json()
            return data

        }catch{
            setStatusError(0)
            return null
        }

        

    }
    return {eliminarCategoria, statusError}

}