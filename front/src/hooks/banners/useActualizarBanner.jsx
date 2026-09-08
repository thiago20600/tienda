import { useState } from "react";
import { usuariosRequest } from "../../services/api/apiClient";

export default function useActualizarBanner() {
    const [cargando, setCargando] = useState(false);
    const [statusError, setStatusError] = useState(null);
    const [exito, setExito] = useState(false);

    const actualizarBanner = async (bannerId, data) => {
        setCargando(true);
        setStatusError(null);
        setExito(false);

        try {
            const response = await usuariosRequest(`/admin/banners/${bannerId}`, {
                method: "PATCH",
                auth: true,
                body: data, // puede ser FormData (con imagen) o JSON
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