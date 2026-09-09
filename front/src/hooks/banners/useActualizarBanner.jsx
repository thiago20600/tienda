import { useState } from "react";
import { tiendaRequest } from "../../services/api/apiClient";

export default function useActualizarBanner() {
    const [cargando, setCargando] = useState(false);
    const [statusError, setStatusError] = useState(null);
    const [exito, setExito] = useState(false);

    const actualizarBanner = async (bannerId, data) => {
        setCargando(true);
        setStatusError(null);
        setExito(false);

        try {
            // El backend espera multipart/form-data con el campo "data" (JSON) y "imagen" opcional
            let body;
            if (data instanceof FormData) {
                body = data;
            } else {
                body = new FormData();
                body.append("data", JSON.stringify(data));
            }

            const response = await tiendaRequest(`/admin/banners/${bannerId}`, {
                method: "PATCH",
                auth: true,
                body,
            });

            const responseData = await response.json().catch(() => ({}));

            if (!response.ok) {
                setStatusError(response.status);
                return { ok: false, data: responseData };
            }

            setExito(true);
            return { ok: true, data: responseData };
        } catch (error) {
            setStatusError(0);
            return { ok: false, data: null };
        } finally {
            setCargando(false);
        }
    };

    return { actualizarBanner, cargando, statusError, exito };
}