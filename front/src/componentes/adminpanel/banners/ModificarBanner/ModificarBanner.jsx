import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import useBanner from '../../../../hooks/banners/useConsultarBanner';
import useActualizarBanner from '../../../../hooks/banners/useActualizarBanner';
import {
  BannerContainer,
  BannerTitle,
  BannerForm,
  BannerLabel,
  BannerInput,
  BannerSelect,
  BannerMessage,
  BannerPreview
} from './ModificarBanner.styles';
import AdminButton from '../../ui/AdminButton/AdminButton'

const ModificarBanner = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { banner, cargando, statusError } = useBanner(id);
  const { actualizarBanner, cargando: guardando } = useActualizarBanner();

  const [formData, setFormData] = useState({
    titulo: '',
    enlace: '',
    titulo_boton: '',
    boton_color: '#2563eb',
    activo: 'true',
    imagen: null
  });
  const [mensaje, setMensaje] = useState(null);

  useEffect(() => {
    if (banner) {
      setFormData({
        titulo: banner.titulo || '',
        enlace: banner.enlace || '',
        titulo_boton: banner.titulo_boton || '',
        boton_color: banner.boton_color || '#2563eb',
        activo: String(banner.activo),
        imagen: null
      });
    }
  }, [banner]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    if (type === 'file') {
      setFormData((prev) => ({ ...prev, imagen: e.target.files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const guardarBanner = async (event) => {
    event.preventDefault();
    setMensaje(null);

    // Solo se envían los campos que cambiaron (PATCH parcial)
    const cambios = {};
    if (formData.titulo.trim() !== banner.titulo) cambios.titulo = formData.titulo.trim();
    if (formData.enlace.trim() !== banner.enlace) cambios.enlace = formData.enlace.trim();
    if (formData.titulo_boton !== banner.titulo_boton) cambios.titulo_boton = formData.titulo_boton;
    if (formData.boton_color !== banner.boton_color) cambios.boton_color = formData.boton_color;
    if (formData.activo !== String(banner.activo)) cambios.activo = formData.activo === 'true';

    if (Object.keys(cambios).length === 0 && !formData.imagen) {
      setMensaje({ error: 'No hay cambios para guardar.' });
      return;
    }

    const payload = new FormData();
    payload.append('data', JSON.stringify(cambios));
    if (formData.imagen) payload.append('imagen', formData.imagen);

    const response = await actualizarBanner(id, payload);

    if (response.ok) {
      setMensaje({ texto: 'Banner actualizado correctamente.' });
    } else {
      setMensaje({ error: typeof response.data?.detail === 'string' ? response.data.detail : 'No se pudieron guardar los cambios.' });
    }
  };

  if (cargando) return <BannerContainer><p>Cargando banner...</p></BannerContainer>;

  if (statusError === 404) {
    return <BannerContainer><p>No se encontró el banner.</p></BannerContainer>;
  }

  return (
    <BannerContainer>
      <AdminButton type="button" $variant="secondary" $size="sm" onClick={() => navigate('/admin/banners')}>Volver a banners</AdminButton>
      <BannerTitle>Editar banner</BannerTitle>

      <BannerPreview>
        <img src={banner?.imagen} alt={banner?.titulo || 'Banner'} />
      </BannerPreview>

      <BannerForm onSubmit={guardarBanner}>
        <BannerLabel htmlFor="titulo">Título
          <BannerInput id="titulo" name="titulo" value={formData.titulo} onChange={handleChange} required />
        </BannerLabel>
        <BannerLabel htmlFor="enlace">Enlace
          <BannerInput id="enlace" name="enlace" value={formData.enlace} onChange={handleChange} required />
        </BannerLabel>
        <BannerLabel htmlFor="titulo_boton">Texto del botón
          <BannerInput id="titulo_boton" name="titulo_boton" value={formData.titulo_boton} onChange={handleChange} />
        </BannerLabel>
        <BannerLabel htmlFor="boton_color">Color del botón
          <BannerInput id="boton_color" name="boton_color" type="color" value={formData.boton_color} onChange={handleChange} />
        </BannerLabel>
        <BannerLabel htmlFor="activo">Estado
          <BannerSelect id="activo" name="activo" value={formData.activo} onChange={handleChange}>
            <option value="true">Activo</option>
            <option value="false">Inactivo</option>
          </BannerSelect>
        </BannerLabel>
        <BannerLabel htmlFor="imagen">Nueva imagen (opcional)
          <BannerInput id="imagen" name="imagen" type="file" accept="image/*" onChange={handleChange} />
        </BannerLabel>
        <AdminButton type="submit" disabled={guardando}>{guardando ? 'Guardando...' : 'Guardar cambios'}</AdminButton>
      </BannerForm>
      {mensaje && <BannerMessage $error={Boolean(mensaje.error)}>{mensaje.error || mensaje.texto}</BannerMessage>}
    </BannerContainer>
  );
};

export default ModificarBanner;