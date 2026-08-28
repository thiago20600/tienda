import { useState } from 'react';
import { usuariosRequest } from '../../services/api/apiClient';
import { useAuth } from '../../services/auth/useAuth';
import {
  ConfigContainer,
  ConfigForm,
  ConfigInput,
  ConfigLabel,
  ConfigTitle,
  ConfigButton,
  ConfigMessage
} from './Configuracion.styles';

const Configuracion = () => {
  const { usuario, actualizarUsuario } = useAuth();
  const [username, setUsername] = useState(usuario?.username || '');
  const [password, setPassword] = useState('');
  const [mensaje, setMensaje] = useState(null);
  const [guardando, setGuardando] = useState(false);

  const guardarCambios = async (event) => {
    event.preventDefault();
    const datos = { username: username.trim() };
    if (password) datos.password = password;
    setGuardando(true);
    setMensaje(null);
    try {
      const response = await usuariosRequest(`/users/${usuario.id}`, {
        method: 'PATCH',
        auth: true,
        body: datos
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        setMensaje({ error: data.detail || 'No se pudieron guardar los cambios.' });
        return;
      }
      actualizarUsuario(data);
      setPassword('');
      setMensaje({ texto: 'Datos actualizados correctamente.' });
    } catch (error) {
      console.error('Error actualizando usuario:', error);
      setMensaje({ error: 'Error de conexión con el servidor.' });
    } finally {
      setGuardando(false);
    }
  };

  if (!usuario) return <ConfigContainer><p>Iniciá sesión para ver tu configuración.</p></ConfigContainer>;

  return (
    <ConfigContainer>
      <ConfigTitle>Configuración de cuenta</ConfigTitle>
      <p>Cuenta: {usuario.email}</p>
      <ConfigForm onSubmit={guardarCambios}>
        <ConfigLabel htmlFor="username">Nombre de usuario
          <ConfigInput id="username" value={username} onChange={(event) => setUsername(event.target.value)} required minLength={3} />
        </ConfigLabel>
        <ConfigLabel htmlFor="password">Nueva contraseña
          <ConfigInput id="password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} minLength={6} placeholder="Dejar vacío para conservarla" />
        </ConfigLabel>
        <ConfigButton type="submit" disabled={guardando}>{guardando ? 'Guardando...' : 'Guardar cambios'}</ConfigButton>
      </ConfigForm>
      {mensaje && <ConfigMessage $error={Boolean(mensaje.error)}>{mensaje.error || mensaje.texto}</ConfigMessage>}
    </ConfigContainer>
  );
};

export default Configuracion;
