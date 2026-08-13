import { useState } from "react"

export default function useCrearCategoria () {


    const accessToken = localStorage.getItem('token')
    const UrlApiBaseProductos = import.meta.env.VITE_API_URL
    const [statusError, setStatusError] = useState(null) 

    const crearCategoria = async (data) => {

        try {
            const response = await fetch(`${UrlApiBaseProductos}/categorias/`, {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                },
                body: JSON.stringify(data)
            })

            if (!response.ok){
                setStatusError(response.status)
            }
            const responseData = await response.json()
            return responseData 
        }catch{
            setStatusError(0)
            return null
        }
    }
    return {crearCategoria, statusError}
}