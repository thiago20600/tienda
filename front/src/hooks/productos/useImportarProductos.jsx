import { useState } from 'react';
import { tiendaRequest } from '../../services/api/apiClient';

export default function useImportarProductos() {
    const [cargando, setCargando] = useState(false);
    const [statusError, setStatusError] = useState(null);

    const importar = async (archivo) => {
        setCargando(true);
        setStatusError(null);
        try {
            const formData = new FormData();
            formData.append('archivo', archivo);

            const response = await tiendaRequest('/admin/productos/importar', {
                method: 'POST',
                auth: true,
                body: formData,
            });

            if (!response.ok) {
                const data = await response.json().catch(() => ({}));
                setStatusError(response.status);
                return { ok: false, detalle: data.detail || null };
            }

            const resultado = await response.json();
            return { ok: true, ...resultado };
        } catch (error) {
            console.error('Error importando productos:', error);
            setStatusError(0);
            return { ok: false, detalle: null };
        } finally {
            setCargando(false);
        }
    };

    return { importar, cargando, statusError };
}
