import { useState } from 'react';
import CambiarPagina from '../../../componentes/adminpanel/tablas/CambiarPagina/CambiarPagina.jsx';
import FiltrosFacturas from '../../../componentes/adminpanel/facturas/FiltrosFacturas.jsx';
import FacturasTabla from '../../../componentes/adminpanel/facturas/FacturasTabla.jsx';
import DetalleFactura from '../../../componentes/facturas/DetalleFactura.jsx';
import useFacturasAdmin from '../../../hooks/facturas/useFacturasAdmin.jsx';
import useReintentarFactura from '../../../hooks/facturas/useReintentarFactura.jsx';
import useProcesarPendientes from '../../../hooks/facturas/useProcesarPendientes.jsx';

const TAMANO_PAGINA = 10;

// Panel de facturacion: monitoreo de emisiones, diagnostico de errores y reintentos.
const FacturasAdmin = () => {
    const [pagina, setPagina] = useState(1);
    const [filtros, setFiltros] = useState({ estado: '', user_email: '', numero_pedido: '' });
    const [seleccionada, setSeleccionada] = useState(null);
    const [mensajeAccion, setMensajeAccion] = useState(null);
    const [reintentandoId, setReintentandoId] = useState(null);

    const { facturas, cargando, statusError, pages: totalPaginas, cambiarPagina, recargar } = useFacturasAdmin({
        page: pagina,
        size: TAMANO_PAGINA,
        estado: filtros.estado,
        userEmail: filtros.user_email,
        numeroPedido: filtros.numero_pedido,
    });

    const { reintentar, reintentando } = useReintentarFactura();
    const { procesarPendientes, procesando } = useProcesarPendientes();

    const cambiarFiltro = (campo, valor) => {
        setFiltros((actuales) => ({ ...actuales, [campo]: valor }));
        setPagina(1);
    };

    const reintentarFactura = async (factura) => {
        setReintentandoId(factura.id);
        try {
            const resultado = await reintentar(factura.id);
            if (resultado.ok) {
                recargar();
            }
            return resultado;
        } finally {
            setReintentandoId(null);
        }
    };

    const handleReintentarDesdeTabla = async (factura) => {
        setMensajeAccion(null);
        const resultado = await reintentarFactura(factura);
        setMensajeAccion(
            resultado.ok
                ? { texto: `Reintento encolado para la factura #${factura.id}.` }
                : { error: resultado.detalle || `No se pudo reintentar (código: ${resultado.status}).` }
        );
    };

    const handleProcesarPendientes = async () => {
        setMensajeAccion(null);
        const resultado = await procesarPendientes();
        setMensajeAccion(
            resultado.ok
                ? { texto: `Se reclaman ${resultado.reclamadas} factura(s) para emisión.` }
                : { error: resultado.detalle || `No se pudo procesar pendientes (código: ${resultado.status}).` }
        );
        if (resultado.ok) recargar();
    };

    return (
        <div>
            <FiltrosFacturas
                filtros={filtros}
                onFiltroChange={cambiarFiltro}
                onProcesarPendientes={handleProcesarPendientes}
                procesando={procesando}
                mensajeAccion={mensajeAccion}
            />

            <FacturasTabla
                facturas={facturas}
                cargando={cargando}
                statusError={statusError}
                onVerDetalle={setSeleccionada}
                onReintentar={handleReintentarDesdeTabla}
                reintentandoId={reintentandoId}
            />

            <CambiarPagina
                paginaActual={pagina}
                totalPaginas={totalPaginas}
                onPageChange={(nuevaPagina) => {
                    setPagina(nuevaPagina);
                    cambiarPagina(nuevaPagina);
                }}
            />

            {seleccionada && (
                <DetalleFactura
                    factura={seleccionada}
                    onCerrar={() => { setSeleccionada(null); recargar(); }}
                    onReintentar={reintentarFactura}
                    reintentando={reintentando && reintentandoId === seleccionada.id}
                />
            )}
        </div>
    );
};

export default FacturasAdmin;
