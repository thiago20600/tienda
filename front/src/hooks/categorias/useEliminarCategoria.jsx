import { useState } from "react"
import { tiendaRequest } from "../../services/api/apiClient"

export default function useEliminarCategoria () {

    const [statusError, setStatusError] = useState(null)


    const eliminarCategoria = async (id) => {
        

        try{
            const response = await tiendaRequest(`/categorias/${id}`, {
                method: 'DELETE',
                auth: true
            })

            if (!response.ok){
                setStatusError(response.status)
                return null
            }

            const data = await response.json()
            return data

        }catch(error){
            console.error('Error eliminando categoria:', error)
            setStatusError(0)
            return null
        }

        

    }
    return {eliminarCategoria, statusError}

}