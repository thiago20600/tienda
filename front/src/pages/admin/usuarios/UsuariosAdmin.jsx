import { Fragment, useState } from 'react';
import { NavLink } from 'react-router-dom';
import useUsuariosAdmin from '../../../hooks/usuarios/useUsuariosAdmin';
import usePedidosAdmin from '../../../hooks/pedidos/usePedidosAdmin';
import {
  UsuariosContainer,
  UsuariosTable,
  EstadoUsuario,
  MensajeUsuarios,
  RolUsuario,
  PedidosUsuario,
  PedidoUsuarioLink
} from './UsuariosAdmin.styles';

const formatearFecha = (fecha) => new Date(fecha).toLocaleDateString('es-AR');

const UsuariosAdmin = () => {
  const { usuarios, cargando, statusError } = useUsuariosAdmin();
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);
  const usuarioActivo = usuarios.find(({ id }) => id === usuarioSeleccionado);
  const { pedidos, cargando: cargandoPedidos, statusError: pedidosError } = usePedidosAdmin({
    userEmail: usuarioActivo?.email,
    enabled: Boolean(usuarioActivo)
  });

  if (cargando) return <MensajeUsuarios>Cargando usuarios...</MensajeUsuarios>;
  if (statusError) return <MensajeUsuarios $error>Error al cargar usuarios (código: {statusError}).</MensajeUsuarios>;
  if (!usuarios.length) return <MensajeUsuarios>No hay usuarios registrados.</MensajeUsuarios>;

  return (
    <UsuariosContainer>
      <h1>Usuarios</h1>
      <UsuariosTable>
        <thead>
          <tr><th>Usuario</th><th>Email</th><th>Rol</th><th>Estado</th></tr>
        </thead>
        <tbody>
          {usuarios.map((usuario) => {
            const estaSeleccionado = usuarioSeleccionado === usuario.id;
            const pedidosUsuario = pedidos;

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
                  <td><RolUsuario $admin={usuario.rol === 'admin'}>{usuario.rol}</RolUsuario></td>
                  <td><EstadoUsuario $activo={usuario.active}>{usuario.active ? 'Activo' : 'Pendiente de activación'}</EstadoUsuario></td>
                </tr>
                {estaSeleccionado && (
                  <tr>
                    <td colSpan="4">
                      <PedidosUsuario>
                        <h2>Pedidos de {usuario.username}</h2>
                        {cargandoPedidos && <p>Cargando pedidos...</p>}
                        {pedidosError && <p>No se pudieron cargar los pedidos.</p>}
                        {!cargandoPedidos && !pedidosError && pedidosUsuario.length === 0 && (
                          <p>Este usuario no tiene pedidos.</p>
                        )}
                        {!cargandoPedidos && !pedidosError && pedidosUsuario.length > 0 && (
                          <ul>
                            {pedidosUsuario.map((pedido) => (
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
    </UsuariosContainer>
  );
};

export default UsuariosAdmin;
