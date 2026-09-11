import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { tiendaRequest } from "../api/apiClient";
import { useAuth } from "../auth/useAuth";

const FavoritosContext = createContext(null);

export function FavoritosProvider({ children }) {
    const { usuario } = useAuth();
    const [favoritos, setFavoritos] = useState([]);
    const [cargando, setCargando] = useState(false);

    useEffect(() => {
        if (!usuario) {
            setFavoritos([]);
            return;
        }

        let vigente = true;

        const cargarFavoritos = async () => {
            setCargando(true);
            try {
                const response = await tiendaRequest('/favoritos', { method: 'GET', auth: true });
                if (!response.ok) return;
                const data = await response.json();
                if (vigente) setFavoritos(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error('Error cargando favoritos:', error);
            } finally {
                if (vigente) setCargando(false);
            }
        };

        cargarFavoritos();
        return () => { vigente = false; };
    }, [usuario]);

    const alternar = useCallback(async (productoId) => {
        const existe = favoritos.some((favorito) => favorito.producto_id === productoId);

        try {
            if (existe) {
                const response = await tiendaRequest(`/favoritos/${productoId}`, { method: 'DELETE', auth: true });
                if (response.ok) setFavoritos((previos) => previos.filter((favorito) => favorito.producto_id !== productoId));
                return response.ok;
            }

            const response = await tiendaRequest(`/favoritos/${productoId}`, { method: 'POST', auth: true });
            if (response.ok) {
                const nuevo = await response.json();
                setFavoritos((previos) => [...previos, nuevo]);
                return true;
            }
            return false;
        } catch (error) {
            console.error('Error alternando favorito:', error);
            return false;
        }
    }, [favoritos]);

    const esFavorito = useCallback(
        (productoId) => favoritos.some((favorito) => favorito.producto_id === productoId),
        [favoritos]
    );

    const value = useMemo(
        () => ({ favoritos, cargando, alternar, esFavorito }),
        [favoritos, cargando, alternar, esFavorito]
    );

    return <FavoritosContext.Provider value={value}>{children}</FavoritosContext.Provider>;
}

export function useFavoritos() {
    const contexto = useContext(FavoritosContext);
    if (!contexto) {
        throw new Error('useFavoritos debe usarse dentro de FavoritosProvider');
    }
    return contexto;
}
