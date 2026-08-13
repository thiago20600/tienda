import { useEffect, useState } from "react";

export default function useProductosAdmin() {
    const [productos, setProductos] = useState([])
    const [cargando, setCargando] = useState(true)
    const UrlApiBaseProductos = import.meta.env.VITE_API_URL
    const [statusError, setStatusError] = useState(null) 
    const accessToken = localStorage.getItem('token')

    useEffect(() => {
        const obtenerProductos = async () => {
            try {
                const response = await fetch(`${UrlApiBaseProductos}/admin/productos`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'authorization': `Bearer ${accessToken}`
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