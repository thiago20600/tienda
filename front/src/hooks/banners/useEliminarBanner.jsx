import { useState } from "react";
import { tiendaRequest } from "../../services/api/apiClient";

export default function useEliminarBanner() {
    const [cargando, setCargando] = useState(false);
    const [statusError, setStatusError] = useState(null);
    const [exito, setExito] = useState(false);

    const eliminarBanner = async (bannerId) => {
        setCargando(true);
        setStatusError(null);
        setExito(false);

        try {
            const response = await tiendaRequest(`/admin/banners/${bannerId}`, {
                method: "DELETE",
                auth: true,
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

    return { eliminarBanner, cargando, statusError, exito };
}