import { Fragment, useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import useUsuariosAdmin from '../../../hooks/usuarios/useUsuariosAdmin';
import usePedidosAdmin from '../../../hooks/pedidos/usePedidosAdmin';
import CambiarPagina from '../../../componentes/adminpanel/tablas/CambiarPagina/CambiarPagina.jsx';
import useDebounce from '../../../../utils/useDebounce';
import useRoles from '../../../hooks/roles/useRoles.jsx';
import {
  UsuariosContainer,
  UsuariosTable,
  EstadoUsuario,
  MensajeUsuarios,
  PedidosUsuario,
  PedidoUsuarioLink,
  BusquedaContainer,
  BusquedaInput
} from './UsuariosAdmin.styles';
import RolUsuario from '../../../componentes/adminpanel/usuarios/RolUsuario.jsx';


const formatearFecha = (fecha) => new Date(fecha).toLocaleDateString('es-AR');
const TAMANO_PAGINA_USUARIOS = 10;
const TAMANO_PAGINA_PEDIDOS = 5;


const UsuariosAdmin = () => {
  const { roles } = useRoles()
  const [paginaUsuarios, setPaginaUsuarios] = useState(1);
  const [paginaPedidosUsuario, setPaginaPedidosUsuario] = useState(1);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);
  const [busqueda, setBusqueda] = useState('');
  const busquedaDebounce = useDebounce(busqueda, 500);

  const { usuarios, cargando, statusError, page: pageUsuarios, pages: pagesUsuarios, cambiarPagina: cambiarPaginaUsuarios } = useUsuariosAdmin({
    q: busquedaDebounce,
    page: paginaUsuarios,
    size: TAMANO_PAGINA_USUARIOS,
  });

  const usuarioActivo = usuarios.find(({ id }) => id === usuarioSeleccionado);

  const { pedidos, cargando: cargandoPedidos, statusError: pedidosError, pages: pagesPedidos, cambiarPagina: cambiarPaginaPedidos } = usePedidosAdmin({
    userEmail: usuarioActivo?.email,
    enabled: Boolean(usuarioActivo),
    page: paginaPedidosUsuario,
    size: TAMANO_PAGINA_PEDIDOS,
  });

  useEffect(() => {
    setPaginaPedidosUsuario(1);
  }, [usuarioSeleccionado]);

  useEffect(() => {
    setPaginaUsuarios(1);
  }, [busquedaDebounce]);

  if (cargando) return <MensajeUsuarios>Cargando usuarios...</MensajeUsuarios>;
  if (statusError) return <MensajeUsuarios $error>Error al cargar usuarios (código: {statusError}).</MensajeUsuarios>;
  if (!usuarios.length) return <MensajeUsuarios>No hay usuarios registrados.</MensajeUsuarios>;

  return (
    <UsuariosContainer>
      <h1>Usuarios</h1>
      <BusquedaContainer>
        <BusquedaInput
          type="text"
          placeholder="Buscar por email..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
      </BusquedaContainer>
      <UsuariosTable>
        <thead>
          <tr><th>Usuario</th><th>Email</th><th>Rol</th><th>Estado</th></tr>
        </thead>
        <tbody>
          {usuarios.map((usuario) => {
            const estaSeleccionado = usuarioSeleccionado === usuario.id;

            return (
              <Fragment key={usuario.id}>
                <tr
                  onClick={() => setUsuarioSeleccionado((seleccionado) => (
                    seleccionado === usuario.id ? null : usuario.id
                  ))}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault();
                      setUsuarioSeleccionado((seleccionado) => (
                        seleccionado === usuario.id ? null : usuario.id
                      ));
                    }
                  }}
                  tabIndex={0}
                  aria-selected={estaSeleccionado}
                >
                  <td>{usuario.username}</td>
                  <td>{usuario.email}</td>
                  <td><RolUsuario usuario={usuario} roles={roles} /></td>
                  <td><EstadoUsuario $activo={usuario.active}>{usuario.active ? 'Activo' : 'Pendiente de activación'}</EstadoUsuario></td>
                </tr>
                {estaSeleccionado && (
                  <tr>
                    <td colSpan="4">
                      <PedidosUsuario>
                        <h2>Pedidos de {usuario.username}</h2>
                        {cargandoPedidos && <p>Cargando pedidos...</p>}
                        {pedidosError && <p>No se pudieron cargar los pedidos.</p>}
                        {!cargandoPedidos && !pedidosError && pedidos.length === 0 && (
                          <p>Este usuario no tiene pedidos.</p>
                        )}
                        {!cargandoPedidos && !pedidosError && pedidos.length > 0 && (
                          <>
                            <ul>
                              {pedidos.map((pedido) => (
                                <li key={pedido.id}>
                                  <PedidoUsuarioLink as={NavLink} to={`/admin/pedidos/${pedido.id}`} onClick={(event) => event.stopPropagation()}>
                                    <strong>{pedido.numero_pedido || `Pedido #${pedido.id}`}</strong>
                                    <span>{pedido.estado.replaceAll('_', ' ')}</span>
                                    <span>{formatearFecha(pedido.created_at)}</span>
                                    <span>${Number(pedido.precio_total).toFixed(2)}</span>
                                  </PedidoUsuarioLink>
                                </li>
                              ))}
                            </ul>
                            <CambiarPagina
                              paginaActual={paginaPedidosUsuario || 1}
                              totalPaginas={pagesPedidos || 1}
                              onPageChange={(nuevaPagina) => {
                                setPaginaPedidosUsuario(nuevaPagina);
                                cambiarPaginaPedidos(nuevaPagina);
                              }}
                            />
                          </>
                        )}
                      </PedidosUsuario>
                    </td>
                  </tr>
                )}
              </Fragment>
            );
          })}
        </tbody>
      </UsuariosTable>
      <CambiarPagina
        paginaActual={pageUsuarios}
        totalPaginas={pagesUsuarios}
        onPageChange={(nuevaPagina) => {
          setPaginaUsuarios(nuevaPagina);
          cambiarPaginaUsuarios(nuevaPagina);
        }}
      />
    </UsuariosContainer>
  );
};

export default UsuariosAdmin;
