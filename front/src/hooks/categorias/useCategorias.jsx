import { useState, useEffect } from "react"

export default function useCategorias() {

        const [categorias, setCategorias] = useState([])
        const [cargando, setCargando] = useState(true)
        const UrlApiBaseProductos = import.meta.env.VITE_API_URL
        const [statusError, setStatusError] = useState(null) 
    
        useEffect(() => {
            const obtenerProductos = async () => {
                try {
                    const response = await fetch(`${UrlApiBaseProductos}/categorias`, {
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
    
        }, [UrlApiBaseProductos])
    
        return { categorias, statusError, cargando }
}
        
