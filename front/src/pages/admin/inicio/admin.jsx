import { NavLink } from 'react-router-dom';
import useProductosAdmin from '../../../hooks/productos/useProductosAdmin';
import usePedidosAdmin from '../../../hooks/pedidos/usePedidosAdmin';
import useUsuariosAdmin from '../../../hooks/usuarios/useUsuariosAdmin';
import useMetricas from '../../../hooks/metricas/useMetricas';
import {
    DashboardCard,
    DashboardContainer,
    DashboardGrid,
    DashboardLink,
    DashboardList,
    DashboardListItem,
    DashboardImg,
    DashboardImgPlaceholder,
    DashboardMessage,
} from './admin.styles';

const formatearIngresos = (valor) =>
    new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 2 }).format(valor || 0);

const urlImagen = (urls) => urls?.[0] || null;

const AdminPage = () => {
    const { total: totalProductos, cargando: cargandoProductos } = useProductosAdmin();
    const { cargando: cargandoPedidos } = usePedidosAdmin();
    const { usuarios, cargando: cargandoUsuarios } = useUsuariosAdmin();
    const { metricas, cargando: cargandoMetricas, statusError } = useMetricas();
    const cargando = cargandoProductos || cargandoPedidos || cargandoUsuarios || cargandoMetricas;

    return (
        <DashboardContainer>
            <h1>Panel de administración</h1>
            <p>Consultá rápidamente el estado de tu tienda.</p>
            <DashboardGrid>
                <DashboardCard>
                    <span>Pedidos totales</span>
                    <strong>{cargandoMetricas ? '...' : metricas?.total_pedidos ?? '—'}</strong>
                    <DashboardLink as={NavLink} to="/admin/pedidos">Ver pedidos</DashboardLink>
                </DashboardCard>
                <DashboardCard>
                    <span>Ingresos</span>
                    <strong>{cargandoMetricas ? '...' : formatearIngresos(metricas?.ingresos)}</strong>
                </DashboardCard>
                <DashboardCard>
                    <span>Productos</span>
                    <strong>{cargando ? '...' : totalProductos}</strong>
                    <DashboardLink as={NavLink} to="/admin/productos">Ver productos</DashboardLink>
                </DashboardCard>
                <DashboardCard>
                    <span>Usuarios</span>
                    <strong>{cargando ? '...' : usuarios.length}</strong>
                    <DashboardLink as={NavLink} to="/admin/usuarios">Ver usuarios</DashboardLink>
                </DashboardCard>
            </DashboardGrid>
            {statusError === 0 && <DashboardMessage>Error al cargar métricas.</DashboardMessage>}
            {metricas && metricas.pedidos_por_estado?.length > 0 && (
                <DashboardGrid>
                    {metricas.pedidos_por_estado.map((item) => (
                        <DashboardCard key={item.estado}>
                            <span>Pedidos {item.estado}</span>
                            <strong>{item.total}</strong>
                        </DashboardCard>
                    ))}
                </DashboardGrid>
            )}
            {metricas && metricas.stock_bajo?.length > 0 && (
                <DashboardGrid>
                    <DashboardCard>
                        <span>Stock bajo ({metricas.stock_bajo.length})</span>
                        <DashboardList>
                            {metricas.stock_bajo.map((p) => (
                                <DashboardListItem key={p.id}>
                                    {urlImagen(p.imagen_url) ? (
                                        <DashboardImg src={urlImagen(p.imagen_url)} alt={p.nombre} />
                                    ) : (
                                        <DashboardImgPlaceholder />
                                    )}
                                    <NavLink to={`/admin/productos/${p.id}`} style={{ flex: 1 }}>
                                        <strong style={{ fontSize: '1rem', color: '#1e293b' }}>{p.nombre}</strong>
                                        <span style={{ display: 'block', color: '#ef4444', fontSize: '0.85rem' }}>Stock: {p.stock}</span>
                                    </NavLink>
                                </DashboardListItem>
                            ))}
                        </DashboardList>
                        <DashboardLink as={NavLink} to="/admin/productos">Reponer stock</DashboardLink>
                    </DashboardCard>
                </DashboardGrid>
            )}
            {metricas && metricas.top_productos?.length > 0 && (
                <DashboardGrid>
                    <DashboardCard>
                        <span>Top productos ({metricas.top_productos.length})</span>
                        <DashboardList>
                            {metricas.top_productos.map((p) => (
                                <DashboardListItem key={p.producto_id}>
                                    {urlImagen(p.imagen_url) ? (
                                        <DashboardImg src={urlImagen(p.imagen_url)} alt={p.nombre} />
                                    ) : (
                                        <DashboardImgPlaceholder />
                                    )}
                                    <NavLink to={`/admin/productos/${p.producto_id}`} style={{ flex: 1 }}>
                                        <strong style={{ fontSize: '1rem', color: '#1e293b' }}>{p.nombre}</strong>
                                        <span style={{ display: 'block', color: '#16a34a', fontSize: '0.85rem' }}>Vendido: {p.unidades}</span>
                                    </NavLink>
                                </DashboardListItem>
                            ))}
                        </DashboardList>
                        <DashboardLink as={NavLink} to="/admin/productos">Ver catálogo</DashboardLink>
                    </DashboardCard>
                </DashboardGrid>
            )}
            {cargando && <DashboardMessage>Cargando resumen...</DashboardMessage>}
        </DashboardContainer>
    );
};

export default AdminPage;
