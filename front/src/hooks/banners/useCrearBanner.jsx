import { useState } from "react";
import { tiendaRequest } from "../../services/api/apiClient";

export default function useCrearBanner() {
    const [cargando, setCargando] = useState(false);
    const [statusError, setStatusError] = useState(null);
    const [exito, setExito] = useState(false);

    const crearBanner = async (formData) => {
        setCargando(true);
        setStatusError(null);
        setExito(false);

        try {
            const response = await tiendaRequest("/admin/banners", {
                method: "POST",
                auth: true,
                body: formData, // FormData (incluye imagen)
                headers: {}, // no setear Content-Type, fetch lo hace con FormData
            });

            const data = await response.json().catch(() => ({}));

            if (!response.ok) {
                setStatusError(response.status);
                return { ok: false, data };
            }

            setExito(true);
            return { ok: true, data };
        } catch (error) {
            setStatusError(0);
            return { ok: false, data: null };
        } finally {
            setCargando(false);
        }
    };

    return { crearBanner, cargando, statusError, exito };
}