import { useState } from "react";
import TablaBanners from "../../../componentes/adminpanel/banners/TablaBanners/TablaBanners";
import useBanners from "../../../hooks/banners/useBanners";
import useCrearBanner from "../../../hooks/banners/useCrearBanner";
import {
    BannersContainer,
    BannersHeader,
    CrearBannerBoton,
    MensajeBanners,
    ModalOverlay,
    ModalContenido,
    ModalHeader,
    ModalForm,
    ModalLabel,
    ModalInput,
    ModalSelect,
    ModalAcciones,
    BotonPrimario,
    BotonSecundario,
    PreviewImagen
} from "./bannersAdmin.styles";

const BannersAdmin = () => {
    const { banners, cargando, statusError, recargar } = useBanners(true);
    const { crearBanner, cargando: cargandoCrear } = useCrearBanner();

    const [modalAbierto, setModalAbierto] = useState(false);
    const [mensajeCrear, setMensajeCrear] = useState(null);
    const [formData, setFormData] = useState({
        titulo: '',
        enlace: '',
        titulo_boton: 'Ver más',
        boton_color: '#2563eb',
        activo: 'true',
        imagen: null
    });
    const [previewImagen, setPreviewImagen] = useState(null);

    const cerrarModal = () => {
        setModalAbierto(false);
        setMensajeCrear(null);
        setFormData({ titulo: '', enlace: '', titulo_boton: 'Ver más', boton_color: '#2563eb', activo: 'true', imagen: null });
        setPreviewImagen(null);
    };

    const handleChange = (e) => {
        const { name, value, type } = e.target;
        if (type === 'file') {
            const archivo = e.target.files[0];
            setFormData((prev) => ({ ...prev, imagen: archivo }));
            setPreviewImagen(archivo ? URL.createObjectURL(archivo) : null);
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleCrearBanner = async (e) => {
        e.preventDefault();
        setMensajeCrear(null);

        if (!formData.titulo.trim() || !formData.enlace.trim() || !formData.imagen) {
            setMensajeCrear({ error: 'Completá el título, el enlace y seleccioná una imagen.' });
            return;
        }

        const payload = new FormData();
        payload.append('titulo', formData.titulo.trim());
        payload.append('enlace', formData.enlace.trim());
        payload.append('titulo_boton', formData.titulo_boton || 'Ver más');
        payload.append('boton_color', formData.boton_color || '#2563eb');
        payload.append('activo', formData.activo === 'true');
        payload.append('imagen', formData.imagen);

        const resultado = await crearBanner(payload);

        if (resultado.ok) {
            cerrarModal();
            recargar();
        } else {
            const detalle = resultado.data?.detail;
            setMensajeCrear({ error: typeof detalle === 'string' ? detalle : `Error al crear el banner (código: ${resultado.data ? 'validación' : 'servidor'})` });
        }
    };

    return (
        <BannersContainer>
            <BannersHeader>
                <h1>Banners</h1>
                <CrearBannerBoton type="button" onClick={() => setModalAbierto(true)}>+ Crear banner</CrearBannerBoton>
            </BannersHeader>

            <TablaBanners
                banners={banners}
                cargando={cargando}
                statusError={statusError}
                onRecargar={recargar}
            />

            {modalAbierto && (
                <ModalOverlay onClick={cerrarModal}>
                    <ModalContenido onClick={(e) => e.stopPropagation()}>
                        <ModalHeader>
                            <h2>Crear banner</h2>
                            <button type="button" onClick={cerrarModal}>X</button>
                        </ModalHeader>

                        <ModalForm onSubmit={handleCrearBanner}>
                            <ModalLabel htmlFor="banner-titulo">Título
                                <ModalInput id="banner-titulo" name="titulo" type="text" placeholder="Título del banner" value={formData.titulo} onChange={handleChange} />
                            </ModalLabel>

                            <ModalLabel htmlFor="banner-enlace">Enlace
                                <ModalInput id="banner-enlace" name="enlace" type="text" placeholder="/productos o https://..." value={formData.enlace} onChange={handleChange} />
                            </ModalLabel>

                            <ModalLabel htmlFor="banner-titulo-boton">Texto del botón
                                <ModalInput id="banner-titulo-boton" name="titulo_boton" type="text" placeholder="Ver más" value={formData.titulo_boton} onChange={handleChange} />
                            </ModalLabel>

                            <ModalLabel htmlFor="banner-color">Color del botón
                                <ModalInput id="banner-color" name="boton_color" type="color" value={formData.boton_color} onChange={handleChange} />
                            </ModalLabel>

                            <ModalLabel htmlFor="banner-activo">Estado
                                <ModalSelect id="banner-activo" name="activo" value={formData.activo} onChange={handleChange}>
                                    <option value="true">Activo</option>
                                    <option value="false">Inactivo</option>
                                </ModalSelect>
                            </ModalLabel>

                            <ModalLabel htmlFor="banner-imagen">Imagen
                                <ModalInput id="banner-imagen" name="imagen" type="file" accept="image/*" onChange={handleChange} />
                            </ModalLabel>

                            {previewImagen && (
                                <PreviewImagen src={previewImagen} alt="Previsualización del banner" />
                            )}

                            {mensajeCrear && <MensajeBanners $error={Boolean(mensajeCrear.error)}>{mensajeCrear.error || mensajeCrear.texto}</MensajeBanners>}

                            <ModalAcciones>
                                <BotonSecundario type="button" onClick={cerrarModal}>Cancelar</BotonSecundario>
                                <BotonPrimario type="submit" disabled={cargandoCrear}>{cargandoCrear ? 'Guardando...' : 'Crear banner'}</BotonPrimario>
                            </ModalAcciones>
                        </ModalForm>
                    </ModalContenido>
                </ModalOverlay>
            )}
        </BannersContainer>
    );
};

export default BannersAdmin;