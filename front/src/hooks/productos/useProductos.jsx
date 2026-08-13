import { useEffect, useState } from "react";

export default function useProductos() {
    const [productos, setProductos] = useState([])
    const [cargando, setCargando] = useState(true)
    const UrlApiBaseProductos = import.meta.env.VITE_API_URL
    const [statusError, setStatusError] = useState(null) 

    useEffect(() => {
        const obtenerProductos = async () => {
            try {
                const response = await fetch(`${UrlApiBaseProductos}/productos`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                if (!response.ok) {
                    setStatusError(response.status)
                } else {
                    const data = await response.json()
                    setProductos(data)
                    setStatusError(null)
                }
            } catch (error) {
                setStatusError(0)
                console.error('Error en useProductos:', error)
            } finally {
                setCargando(false)
            }
        }

        obtenerProductos()

    }, [UrlApiBaseProductos])

    return { productos, statusError, cargando }
}