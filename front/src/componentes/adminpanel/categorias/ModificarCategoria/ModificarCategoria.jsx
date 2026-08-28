import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { tiendaRequest } from '../../../../services/api/apiClient';
import {
  CategoriaContainer,
  CategoriaForm,
  CategoriaInput,
  CategoriaLabel,
  CategoriaSelect,
  CategoriaTitle,
  CategoriaButton,
  CategoriaBack,
  CategoriaMessage
} from './ModificarCategoria.styles';

const ModificarCategoria = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [nombre, setNombre] = useState('');
  const [estado, setEstado] = useState('true');
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [mensaje, setMensaje] = useState(null);

  useEffect(() => {
    const cargarCategoria = async () => {
      try {
        const response = await tiendaRequest(`/categorias/${id}`);
        const data = await response.json().catch(() => ({}));
        if (!response.ok) {
          setMensaje({ error: data.detail || 'No se pudo cargar la categoría.' });
          return;
        }
        setNombre(data.nombre || '');
        setEstado(String(data.estado));
      } catch (error) {
        console.error('Error cargando categoría:', error);
        setMensaje({ error: 'Error de conexión con el servidor.' });
      } finally {
        setCargando(false);
      }
    };

    cargarCategoria();
  }, [id]);

  const guardarCategoria = async (event) => {
    event.preventDefault();
    setGuardando(true);
    setMensaje(null);
    try {
      const response = await tiendaRequest(`/categorias/${id}`, {
        method: 'PATCH',
        auth: true,
        body: { nombre: nombre.trim(), estado: estado === 'true' }
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        setMensaje({ error: data.detail || 'No se pudieron guardar los cambios.' });
        return;
      }
      setMensaje({ texto: 'Categoría actualizada correctamente.' });
    } catch (error) {
      console.error('Error actualizando categoría:', error);
      setMensaje({ error: 'Error de conexión con el servidor.' });
    } finally {
      setGuardando(false);
    }
  };

  if (cargando) return <CategoriaContainer><p>Cargando categoría...</p></CategoriaContainer>;

  return (
    <CategoriaContainer>
      <CategoriaBack type="button" onClick={() => navigate('/admin/categorias')}>Volver a categorías</CategoriaBack>
      <CategoriaTitle>Editar categoría</CategoriaTitle>
      <CategoriaForm onSubmit={guardarCategoria}>
        <CategoriaLabel htmlFor="nombre">Nombre
          <CategoriaInput id="nombre" value={nombre} onChange={(event) => setNombre(event.target.value)} required />
        </CategoriaLabel>
        <CategoriaLabel htmlFor="estado">Estado
          <CategoriaSelect id="estado" value={estado} onChange={(event) => setEstado(event.target.value)}>
            <option value="true">Activa</option>
            <option value="false">Inactiva</option>
          </CategoriaSelect>
        </CategoriaLabel>
        <CategoriaButton type="submit" disabled={guardando}>{guardando ? 'Guardando...' : 'Guardar cambios'}</CategoriaButton>
      </CategoriaForm>
      {mensaje && <CategoriaMessage $error={Boolean(mensaje.error)}>{mensaje.error || mensaje.texto}</CategoriaMessage>}
    </CategoriaContainer>
  );
};

export default ModificarCategoria;
