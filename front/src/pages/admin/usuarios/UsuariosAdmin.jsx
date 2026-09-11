import { Fragment, useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import useUsuariosAdmin from '../../../hooks/usuarios/useUsuariosAdmin';
import usePedidosAdmin from '../../../hooks/pedidos/usePedidosAdmin';
import CambiarPagina from '../../../componentes/adminpanel/tablas/CambiarPagina/CambiarPagina.jsx';
import useDebounce from '../../../../utils/useDebounce';
import useRoles from '../../../hooks/roles/useRoles.jsx';
import AltaEmpleado from '../../../componentes/adminpanel/usuarios/AltaEmpleado/AltaEmpleado.jsx';
import {
  UsuariosContainer,
  UsuariosTable,
  EstadoUsuario,
  MensajeUsuarios,
  PedidosUsuario,
  PedidoUsuarioLink,
  BusquedaContainer,
  BusquedaInput,
  FiltrosUsuariosContainer,
  FiltroUsuariosGrupo,
  FiltroUsuariosLabel,
  FiltroUsuariosSelect
} from './UsuariosAdmin.styles';
import AdminButton from '../../../componentes/adminpanel/ui/AdminButton/AdminButton'
import RolUsuario from '../../../componentes/adminpanel/usuarios/RolUsuario.jsx';


const formatearFecha = (fecha) => new Date(fecha).toLocaleDateString('es-AR');
const TAMANO_PAGINA_USUARIOS = 10;
const TAMANO_PAGINA_PEDIDOS = 5;
const TIPOS_USUARIOS = [
  { value: '', label: 'Todos los tipos' },
  { value: 'cliente', label: 'Clientes' },
  { value: 'empleado', label: 'Empleados' },
];


const UsuariosAdmin = () => {
  const { roles } = useRoles()
  const [paginaUsuarios, setPaginaUsuarios] = useState(1);
  const [paginaPedidosUsuario, setPaginaPedidosUsuario] = useState(1);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);
  const [busqueda, setBusqueda] = useState('');
  const [filtroRol, setFiltroRol] = useState('');
  const [filtroTipo, setFiltroTipo] = useState('');
  const [altaEmpleadoAbierto, setAltaEmpleadoAbierto] = useState(false);
  const busquedaDebounce = useDebounce(busqueda, 500);

  const { usuarios, cargando, statusError, page: pageUsuarios, pages: pagesUsuarios, cambiarPagina: cambiarPaginaUsuarios, recargar: recargarUsuarios } = useUsuariosAdmin({
    q: busquedaDebounce,
    rol: filtroRol,
    tipo: filtroTipo,
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
  }, [busquedaDebounce, filtroRol, filtroTipo]);

  const handleEmpleadoCreado = () => {
    setPaginaUsuarios(1);
    recargarUsuarios();
  };

  if (cargando) return <MensajeUsuarios>Cargando usuarios...</MensajeUsuarios>;
  if (statusError) return <MensajeUsuarios $error>Error al cargar usuarios (código: {statusError}).</MensajeUsuarios>;
  if (!usuarios.length && !busquedaDebounce && !filtroRol && !filtroTipo) return <MensajeUsuarios>No hay usuarios registrados.</MensajeUsuarios>;

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
      <FiltrosUsuariosContainer>
        <FiltroUsuariosGrupo>
          <FiltroUsuariosLabel htmlFor="filtro-usuario-tipo">Tipo</FiltroUsuariosLabel>
          <FiltroUsuariosSelect
            id="filtro-usuario-tipo"
            value={filtroTipo}
            onChange={(e) => setFiltroTipo(e.target.value)}
          >
            {TIPOS_USUARIOS.map((tipo) => (
              <option key={tipo.value} value={tipo.value}>{tipo.label}</option>
            ))}
          </FiltroUsuariosSelect>
        </FiltroUsuariosGrupo>
        <FiltroUsuariosGrupo>
          <FiltroUsuariosLabel htmlFor="filtro-usuario-rol">Rol</FiltroUsuariosLabel>
          <FiltroUsuariosSelect
            id="filtro-usuario-rol"
            value={filtroRol}
            onChange={(e) => setFiltroRol(e.target.value)}
          >
            <option value="">Todos los roles</option>
            {roles.map((rol) => (
              <option key={rol.id} value={rol.nombre}>{rol.nombre}</option>
            ))}
          </FiltroUsuariosSelect>
        </FiltroUsuariosGrupo>
        <AdminButton type="button" onClick={() => setAltaEmpleadoAbierto(true)}>
          + Dar de alta empleado
        </AdminButton>
      </FiltrosUsuariosContainer>
      <UsuariosTable>
        <thead>
          <tr><th>Usuario</th><th>Email</th><th>Rol</th><th>Estado</th></tr>
        </thead>
        <tbody>
          {usuarios.length === 0 && (
            <tr>
              <td colSpan="4">
                <MensajeUsuarios>No se encontraron usuarios con esos filtros.</MensajeUsuarios>
              </td>
            </tr>
          )}
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
      {altaEmpleadoAbierto && (
        <AltaEmpleado
          roles={roles}
          onEmpleadoCreado={handleEmpleadoCreado}
          onCerrar={() => setAltaEmpleadoAbierto(false)}
        />
      )}
    </UsuariosContainer>
  );
};

export default UsuariosAdmin;
