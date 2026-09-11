import { NavLink } from "react-router-dom"
import useEliminarBanner from "../../../../hooks/banners/useEliminarBanner"
import {
    TablaBanners as TablaContainer,
    EncabezadoTabla,
    FilaBanner,
    ImagenBanner,
    EstadoBadge,
    BotonPreview,
    MensajeTabla
} from "./TablaBanners.styles"
import AdminButton from "../../ui/AdminButton/AdminButton"

const TablaBanners = ({ banners = [], cargando, statusError, onRecargar }) => {
    const { eliminarBanner, cargando: cargandoEliminar } = useEliminarBanner();

    const manejarEliminar = async (event, banner) => {
        event.preventDefault();
        event.stopPropagation();
        if (!window.confirm(`¿Eliminar el banner "${banner.titulo}"?`)) return;

        const resultado = await eliminarBanner(banner.id);
        if (resultado?.ok) {
            if (onRecargar) onRecargar();
        } else {
            window.alert(`Error al eliminar el banner${resultado?.data?.detail ? `: ${resultado.data.detail}` : '.'}`);
        }
    };

    if (cargando) return <MensajeTabla>Cargando banners...</MensajeTabla>;
    if (statusError === 401) return <MensajeTabla $error>No autorizado para ver los banners.</MensajeTabla>;
    if (statusError) return <MensajeTabla $error>Error al cargar los banners (Código: {statusError}).</MensajeTabla>;
    if (banners.length === 0) return <MensajeTabla>No hay banners creados todavía. Usá el botón "Crear banner" para agregar el primero.</MensajeTabla>;

    return (
        <TablaContainer>
            <EncabezadoTabla>
                <span>Imagen</span>
                <span>Título</span>
                <span>Enlace</span>
                <span>Botón</span>
                <span>Estado</span>
                <span>Acciones</span>
            </EncabezadoTabla>
            <ul>
                {banners.map((banner) => (
                    <li key={banner.id}>
                        <NavLink to={`/admin/banners/${banner.id}`}>
                            <ImagenBanner src={banner.imagen} alt={banner.titulo} />
                            <FilaBanner $titulo>{banner.titulo}</FilaBanner>
                            <FilaBanner>{banner.enlace}</FilaBanner>
                            <FilaBanner>
                                <BotonPreview $color={banner.boton_color}>{banner.titulo_boton}</BotonPreview>
                            </FilaBanner>
                            <FilaBanner>
                                <EstadoBadge $activo={banner.activo}>{banner.activo ? 'Activo' : 'Inactivo'}</EstadoBadge>
                            </FilaBanner>
                        </NavLink>
                        <AdminButton
                            type="button"
                            $variant="danger"
                            $size="sm"
                            title="Eliminar banner"
                            disabled={cargandoEliminar}
                            onClick={(e) => manejarEliminar(e, banner)}
                        >
                            🗑
                        </AdminButton>
                    </li>
                ))}
            </ul>
        </TablaContainer>
    );
};

export default TablaBanners;