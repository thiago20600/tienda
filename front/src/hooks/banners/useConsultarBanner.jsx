import { useState, useEffect } from "react";
import { usuariosRequest } from "../../services/api/apiClient";

export default function useBanner(bannerId) {
    const [banner, setBanner] = useState(null);
    const [cargando, setCargando] = useState(true);
    const [statusError, setStatusError] = useState(null);

    const obtenerBanner = async () => {
        if (!bannerId) return;
        
        setCargando(true);
        try {
            const response = await usuariosRequest(`/admin/banners/${bannerId}`, {
                method: "GET",
                auth: true,
            });

            if (!response.ok) {
                setStatusError(response.status);
                return;
            }

            const data = await response.json();
            setBanner(data);
            setStatusError(null);
        } catch (error) {
            setStatusError(0);
        } finally {
            setCargando(false);
        }
    };

    useEffect(() => {
        obtenerBanner();
    }, [bannerId]);

    return { banner, cargando, statusError, recargar: obtenerBanner };
}