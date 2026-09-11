import { useState, useEffect } from "react"
import { tiendaRequest } from "../../services/api/apiClient"

export default function useCategorias() {

        const [categorias, setCategorias] = useState([])
        const [cargando, setCargando] = useState(true)
        const [statusError, setStatusError] = useState(null) 
    
        useEffect(() => {
            const obtenerProductos = async () => {
                try {
                    const response = await tiendaRequest('/categorias/', {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    })
                    if (!response.ok) {
                        setStatusError(response.status)
                    } else {
                        const data = await response.json()
                        setCategorias(data)
                        setStatusError(null)
                    }
                } catch (error) {
                    setStatusError(0)
                    console.error('Error en useCategorias:', error)
                } finally {
                    setCargando(false)
                }
            }
    
            obtenerProductos()
    
        }, [])
    
        return { categorias, statusError, cargando }
}
        
