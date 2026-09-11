import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { tiendaRequest } from '../../../../services/api/apiClient';
import useImagenCategoria from '../../../../hooks/categorias/useImagenCategoria';
import {
  CategoriaContainer,
  CategoriaForm,
  CategoriaInput,
  CategoriaLabel,
  CategoriaSelect,
  CategoriaTitle,
  CategoriaButton,
  CategoriaBack,
  CategoriaMessage,
  CategoriaImagenWrapper,
  CategoriaImagenPreview,
  CategoriaImagenInput,
  CategoriaImagenButton,
  CategoriaImagenActual
} from './ModificarCategoria.styles';

const ModificarCategoria = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [nombre, setNombre] = useState('');
  const [estado, setEstado] = useState('true');
  const [imagenActual, setImagenActual] = useState(null);
  const [nuevaImagen, setNuevaImagen] = useState(null);
  const [previewImagen, setPreviewImagen] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [mensaje, setMensaje] = useState(null);
  const { subirImagen: hookSubirImagen, subiendo: subiendoImagen } = useImagenCategoria();

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
        if (data.imagen_url && data.imagen_url.length > 0) {
          setImagenActual(data.imagen_url[0]);
        }
      } catch (error) {
        console.error('Error cargando categoría:', error);
        setMensaje({ error: 'Error de conexión con el servidor.' });
      } finally {
        setCargando(false);
      }
    };

    cargarCategoria();
  }, [id]);

  const handleImagenChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNuevaImagen(file);
      setPreviewImagen(URL.createObjectURL(file));
    }
  };

  const subirImagen = async () => {
    if (!nuevaImagen) return;
    setMensaje(null);
    const data = await hookSubirImagen(id, nuevaImagen);
    if (data) {
      setImagenActual(data.imagen_url?.[0] || null);
      setNuevaImagen(null);
      setPreviewImagen(null);
      setMensaje({ texto: 'Imagen subida correctamente.' });
    } else {
      setMensaje({ error: 'No se pudo subir la imagen.' });
    }
  };

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
        <CategoriaImagenWrapper>
        <CategoriaLabel>Imagen de la categoría
          {imagenActual && !previewImagen && (
            <CategoriaImagenActual src={imagenActual} alt="Imagen actual" />
          )}
          {previewImagen && (
            <CategoriaImagenPreview src={previewImagen} alt="Vista previa" />
          )}
          <CategoriaImagenInput type="file" accept="image/*" onChange={handleImagenChange} />
        </CategoriaLabel>
        {nuevaImagen && (
          <CategoriaImagenButton type="button" onClick={subirImagen} disabled={subiendoImagen}>
            {subiendoImagen ? 'Subiendo...' : 'Subir imagen'}
          </CategoriaImagenButton>
        )}
        </CategoriaImagenWrapper>
        <CategoriaButton type="submit" disabled={guardando}>{guardando ? 'Guardando...' : 'Guardar cambios'}</CategoriaButton>
      </CategoriaForm>
      {mensaje && <CategoriaMessage $error={Boolean(mensaje.error)}>{mensaje.error || mensaje.texto}</CategoriaMessage>}
    </CategoriaContainer>
  );
};

export default ModificarCategoria;
