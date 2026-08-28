import { useState } from "react"
import { tiendaRequest } from "../../services/api/apiClient"

export default function useCrearCategoria () {


    const [statusError, setStatusError] = useState(null) 

    const crearCategoria = async (data) => {

        try {
            const response = await tiendaRequest('/categorias/', {
                method: 'POST',
                auth: true,
                body: data
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