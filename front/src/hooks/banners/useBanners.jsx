import { useState, useEffect } from "react";
import { tiendaRequest } from "../../services/api/apiClient";

export default function useBanners(admin = false) {
    const [banners, setBanners] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [statusError, setStatusError] = useState(null);

    const obtenerBanners = async () => {
        setCargando(true);
        try {
            const endpoint = admin ? "/admin/banners" : "/banners";
            const request = tiendaRequest;
            
            const response = await request(endpoint, {
                method: "GET",
                auth: admin, // solo autentica si es admin
            });

            if (!response.ok) {
                setStatusError(response.status);
                return;
            }

            const data = await response.json();
            setBanners(data);
            setStatusError(null);
        } catch (error) {
            setStatusError(0);
        } finally {
            setCargando(false);
        }
    };

    useEffect(() => {
        obtenerBanners();
    }, []);

    return { banners, cargando, statusError, recargar: obtenerBanners };
}