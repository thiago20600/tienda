import { useMemo, useState } from 'react';
import TablaHeader from '../../../componentes/adminpanel/tablas/TablaHeader/TablaHeader.jsx';
import CambiarPagina from '../../../componentes/adminpanel/tablas/CambiarPagina/CambiarPagina.jsx';
import FiltrosPedidos from '../../../componentes/adminpanel/pedidos/FiltrosPedidos.jsx';
import PedidosTabla from '../../../componentes/adminpanel/pedidos/PedidosTabla.jsx';
import usePedidosAdmin from '../../../hooks/pedidos/usePedidosAdmin.jsx';

const TAMANO_PAGINA = 10;

const PedidosAdmin = () => {
    const { pedidos, cargando, statusError } = usePedidosAdmin();
    const [sortConfig, setSortConfig] = useState({ campo: null, direccion: 'asc' });
    const [filtros, setFiltros] = useState({ numero_pedido: '', estado: '', metodo_pago: '', precio_total: '' });
    const [pagina, setPagina] = useState(1);

    const pedidosFiltrados = useMemo(() => pedidos.filter((pedido) => (
        (pedido.numero_pedido || '').toLowerCase().includes(filtros.numero_pedido.toLowerCase())
        && (!filtros.estado || pedido.estado === filtros.estado)
        && (!filtros.metodo_pago || pedido.metodo_pago === filtros.metodo_pago)
        && (!filtros.precio_total || String(pedido.precio_total).includes(filtros.precio_total))
    )), [pedidos, filtros]);

    const pedidosOrdenados = useMemo(() => {
        if (!sortConfig.campo) return pedidosFiltrados;
        return [...pedidosFiltrados].sort((a, b) => {
            const valorA = a[sortConfig.campo] ?? '';
            const valorB = b[sortConfig.campo] ?? '';
            const comparacion = String(valorA).localeCompare(String(valorB), undefined, { numeric: true });
            return sortConfig.direccion === 'asc' ? comparacion : -comparacion;
        });
    }, [pedidosFiltrados, sortConfig]);

    const totalPaginas = Math.max(1, Math.ceil(pedidosOrdenados.length / TAMANO_PAGINA));
    const pedidosPagina = pedidosOrdenados.slice((pagina - 1) * TAMANO_PAGINA, pagina * TAMANO_PAGINA);

    const cambiarFiltro = (campo, valor) => {
        setFiltros((actuales) => ({ ...actuales, [campo]: valor }));
        setPagina(1);
    };

    return (
        <div>
            <TablaHeader
                areasFiltrar={[
                    { key: 'numero_pedido', label: 'Número' },
                    { key: 'estado', label: 'Estado' },
                    { key: 'metodo_pago', label: 'Método de pago' },
                    { key: 'precio_total', label: 'Precio total' }
                ]}
                onSortChange={(configuracion) => { setSortConfig(configuracion); setPagina(1); }}
            />
            <FiltrosPedidos filtros={filtros} onFiltroChange={cambiarFiltro} />
            <PedidosTabla pedidos={pedidosPagina} cargando={cargando} statusError={statusError} />
            <CambiarPagina paginaActual={pagina} totalPaginas={totalPaginas} onPageChange={setPagina} />
        </div>
    );
};

export default PedidosAdmin