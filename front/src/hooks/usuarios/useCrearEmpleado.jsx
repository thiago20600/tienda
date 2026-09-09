import { useState } from "react";
import { usuariosRequest } from "../../services/api/apiClient";

export default function useCrearEmpleado() {
    const [cargando, setCargando] = useState(false);
    const [statusError, setStatusError] = useState(null);

    const crearEmpleado = async (data) => {
        setCargando(true);
        setStatusError(null);

        try {
            const response = await usuariosRequest("/admin/empleados", {
                method: "POST",
                auth: true,
                body: data,
            });

            const responseData = await response.json().catch(() => ({}));

            if (!response.ok) {
                setStatusError(response.status);
                return { ok: false, data: responseData };
            }

            setStatusError(null);
            return { ok: true, data: responseData };
        } catch (error) {
            setStatusError(0);
            return { ok: false, data: null };
        } finally {
            setCargando(false);
        }
    };

    return { crearEmpleado, cargando, statusError };
}