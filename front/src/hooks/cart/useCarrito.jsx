import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { tiendaRequest } from '../../services/api/apiClient';

export default function useCarrito() {
    const [carrito, setCarrito] = useState(null);
    const [cargando, setCargando] = useState(true);
    const [statusError, setStatusError] = useState(null)

    const navigate = useNavigate();

    // 1. Definimos la función de carga fuera del useEffect
    const cargarCarrito = useCallback(async () => {
        setCargando(true);
        try {
            const response = await tiendaRequest('/mi-carrito', {
                method: 'GET',
                auth: true
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
    }, [navigate]);

    // 2. El useEffect la ejecuta solo al montar el componente
    useEffect(() => {
        // La carga sincroniza el estado con el carrito persistido del usuario.
        // eslint-disable-next-line react-hooks/set-state-in-effect
        cargarCarrito();
    }, [cargarCarrito]);

    // 3. Devolvemos 'recargarCarrito' (que es cargarCarrito) para refrescar desde las vistas
    return { 
        carrito, 
        cargando,
        statusError,
        recargarCarrito: cargarCarrito 
    };
}