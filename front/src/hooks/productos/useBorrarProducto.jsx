import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { tiendaRequest } from "../../services/api/apiClient"


export default function useEliminarProducto() {

    const navigate = useNavigate()
    const [message, setMessage] = useState('') 
    const accessToken = localStorage.getItem('token')

    const eliminarProducto = async (id) => {
        if (!accessToken) {
            setMessage('Sesion no valida')
            navigate('/login')
            return
        }
        
        try {
            const response = await tiendaRequest(`/productos/${id}`,
                {
                    method: 'DELETE',
                    auth: true
                }
            )

            const data = await response.json().catch(() => ({}))
            if (!response.ok) {
                setMessage(data.detail || `Error ${response.status}`)
            } else {
                setMessage(data.message || 'Producto eliminado')
            }
        } catch (error) {
            console.error('Error eliminando producto:', error)
            setMessage('Error de conexión al eliminar el producto.')
        }


    }

    return {eliminarProducto, message}

}