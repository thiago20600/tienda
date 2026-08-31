import { useState } from 'react';
import TablaHeader from '../../../componentes/adminpanel/tablas/TablaHeader/TablaHeader.jsx';
import CambiarPagina from '../../../componentes/adminpanel/tablas/CambiarPagina/CambiarPagina.jsx';
import FiltrosPedidos from '../../../componentes/adminpanel/pedidos/FiltrosPedidos.jsx';
import PedidosTabla from '../../../componentes/adminpanel/pedidos/PedidosTabla.jsx';
import usePedidosAdmin from '../../../hooks/pedidos/usePedidosAdmin.jsx';

const TAMANO_PAGINA = 10;

const PedidosAdmin = () => {
    const [pagina, setPagina] = useState(1);
    const [filtros, setFiltros] = useState({ numero_pedido: '', estado: '', metodo_pago: '', precio_total: '' });

    const { pedidos, cargando, statusError, pages: totalPaginas, cambiarPagina } = usePedidosAdmin({
        page: pagina,
        size: TAMANO_PAGINA,
        numeroPedido: filtros.numero_pedido,
        estado: filtros.estado,
        metodoPago: filtros.metodo_pago,
        precioTotal: filtros.precio_total,
    });

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
            />
            <FiltrosPedidos filtros={filtros} onFiltroChange={cambiarFiltro} />
            <PedidosTabla pedidos={pedidos} cargando={cargando} statusError={statusError} />
            <CambiarPagina paginaActual={pagina} totalPaginas={totalPaginas} onPageChange={(nuevaPagina) => {
                setPagina(nuevaPagina);
                cambiarPagina(nuevaPagina);
            }} />
        </div>
    );
};

export default PedidosAdmin