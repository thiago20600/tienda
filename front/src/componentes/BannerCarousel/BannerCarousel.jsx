import { useState, useEffect } from 'react';
import useBanners from '../../hooks/banners/useBanners';
import {
    BannerCarouselContainer,
    BannerTrack,
    BannerSlide,
    BannerImagen,
    BannerOverlay,
    BannerTitulo,
    BannerBoton,
    BannerFlecha,
    BannerDots,
    BannerDot,
    BannerMensaje
} from './BannerCarousel.styles';

const BannerCarousel = () => {
    const { banners, cargando, statusError } = useBanners();
    const [indiceActual, setIndiceActual] = useState(0);
    const [pausado, setPausado] = useState(false);

    const total = banners.length;

    const cambiar = (direccion) => {
        setIndiceActual((indice) => (indice + direccion + total) % total);
    };

    // Auto-avance cada 5 segundos (se pausa al pasar el mouse)
    useEffect(() => {
        if (total <= 1 || pausado) return undefined;

        const intervalo = setInterval(() => {
            setIndiceActual((indice) => (indice + 1) % total);
        }, 5000);

        return () => clearInterval(intervalo);
    }, [total, pausado]);

    // Reinicia el índice si cambia la lista
    useEffect(() => {
        setIndiceActual(0);
    }, [total]);

    if (cargando) return <BannerMensaje>Cargando banners...</BannerMensaje>;
    if (statusError || total === 0) return null;

    return (
        <BannerCarouselContainer
            onMouseEnter={() => setPausado(true)}
            onMouseLeave={() => setPausado(false)}
        >
            <BannerTrack $indice={indiceActual}>
                {banners.map((banner) => (
                    <BannerSlide key={banner.id}>
                        <BannerImagen src={banner.imagen} alt={banner.titulo} />
                        <BannerOverlay>
                            <BannerTitulo>{banner.titulo}</BannerTitulo>
                            {/^https?:\/\//i.test(banner.enlace) ? (
                                <BannerBoton
                                    as="a"
                                    href={banner.enlace}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    $color={banner.boton_color}
                                >
                                    {banner.titulo_boton}
                                </BannerBoton>
                            ) : (
                                <BannerBoton to={banner.enlace} $color={banner.boton_color}>
                                    {banner.titulo_boton}
                                </BannerBoton>
                            )}
                        </BannerOverlay>
                    </BannerSlide>
                ))}
            </BannerTrack>

            {total > 1 && (
                <>
                    <BannerFlecha type="button" $left onClick={() => cambiar(-1)} aria-label="Banner anterior" />
                    <BannerFlecha type="button" onClick={() => cambiar(1)} aria-label="Banner siguiente" />
                    <BannerDots>
                        {banners.map((banner, indice) => (
                            <BannerDot
                                key={banner.id}
                                type="button"
                                $activo={indice === indiceActual}
                                onClick={() => setIndiceActual(indice)}
                                aria-label={`Ir al banner ${indice + 1}`}
                            />
                        ))}
                    </BannerDots>
                </>
            )}
        </BannerCarouselContainer>
    );
};

export default BannerCarousel;