import useUsuariosAdmin from '../../../hooks/usuarios/useUsuariosAdmin';
import {
  UsuariosContainer,
  UsuariosTable,
  EstadoUsuario,
  MensajeUsuarios,
  RolUsuario
} from './UsuariosAdmin.styles';

const UsuariosAdmin = () => {
  const { usuarios, cargando, statusError } = useUsuariosAdmin();

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
          {usuarios.map((usuario) => (
            <tr key={usuario.id}>
              <td>{usuario.username}</td>
              <td>{usuario.email}</td>
              <td><RolUsuario $admin={usuario.rol === 'admin'}>{usuario.rol}</RolUsuario></td>
              <td><EstadoUsuario $activo={usuario.active}>{usuario.active ? 'Activo' : 'Pendiente de activación'}</EstadoUsuario></td>
            </tr>
          ))}
        </tbody>
      </UsuariosTable>
    </UsuariosContainer>
  );
};

export default UsuariosAdmin;
