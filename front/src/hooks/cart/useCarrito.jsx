import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

export default function useCarrito() {
    const [carrito, setCarrito] = useState(null);
    const [message, setMessage] = useState('');
    const [cargando, setCargando] = useState(true);
    const [statusError, setStatusError] = useState(null)

    const navigate = useNavigate();
    const UrlApiBaseProductos = import.meta.env.VITE_API_URL;

    // 1. Definimos la función de carga fuera del useEffect
    const cargarCarrito = useCallback(async () => {
        const accessToken = localStorage.getItem('token');
        try {
            const response = await fetch(`${UrlApiBaseProductos}/mi-carrito`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                }
            });
            
            if (!response.ok) {
                setStatusError(response.status)
                if (response.status === 401) {
                    navigate('/login');
                }
                return;
            }
            
            const carritoData = await response.json();
            setCarrito(carritoData)
            setStatusError(null)
        } catch (error) {
            console.error("Error cargando carrito:", error);
            setStatusError(0);
        } finally {
            setCargando(false);
        }
    }, [UrlApiBaseProductos, navigate]);

    // 2. El useEffect la ejecuta solo al montar el componente
    useEffect(() => {
        cargarCarrito();
    }, [cargarCarrito]);

    // 3. Devolvemos 'recargarCarrito' (que es cargarCarrito) para refrescar desde las vistas
    return { 
        carrito, 
        message, 
        cargando,
        statusError,
        recargarCarrito: cargarCarrito 
    };
}