import { NavLink } from 'react-router-dom';
import useProductosAdmin from '../../../hooks/productos/useProductosAdmin';
import usePedidosAdmin from '../../../hooks/pedidos/usePedidosAdmin';
import useUsuariosAdmin from '../../../hooks/usuarios/useUsuariosAdmin';
import { DashboardCard, DashboardContainer, DashboardGrid, DashboardLink, DashboardMessage } from './admin.styles';

const AdminPage = () => {
    const { total: totalProductos, cargando: cargandoProductos } = useProductosAdmin();
    const { pedidos, cargando: cargandoPedidos } = usePedidosAdmin();
    const { usuarios, cargando: cargandoUsuarios } = useUsuariosAdmin();
    const cargando = cargandoProductos || cargandoPedidos || cargandoUsuarios;

    return (
        <DashboardContainer>
            <h1>Panel de administración</h1>
            <p>Consultá rápidamente el estado de tu tienda.</p>
            <DashboardGrid>
                <DashboardCard>
                    <span>Productos</span>
                    <strong>{cargando ? '...' : totalProductos}</strong>
                    <DashboardLink as={NavLink} to="/admin/productos">Ver productos</DashboardLink>
                </DashboardCard>
                <DashboardCard>
                    <span>Pedidos</span>
                    <strong>{cargando ? '...' : pedidos.length}</strong>
                    <DashboardLink as={NavLink} to="/admin/pedidos">Ver pedidos</DashboardLink>
                </DashboardCard>
                <DashboardCard>
                    <span>Usuarios</span>
                    <strong>{cargando ? '...' : usuarios.length}</strong>
                    <DashboardLink as={NavLink} to="/admin/usuarios">Ver usuarios</DashboardLink>
                </DashboardCard>
            </DashboardGrid>
            {cargando && <DashboardMessage>Cargando resumen...</DashboardMessage>}
        </DashboardContainer>
    )
} 

export default AdminPage