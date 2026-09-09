import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
    CarouselContainer,
    SeccionTitulo,
    CarouselArrowsWrapper,
    Viewport,
    Track,
    Slide,
    Flecha,
    Dots,
    Dot,
    Mensaje,
} from './Carousel.styles';

const Carousel = ({
    items,
    renderItem,
    titulo = null,
    itemsVisibles = 4,
    gapPx = 12,
    mensajeVacio = null,
}) => {
    const [indiceActual, setIndiceActual] = useState(0);
    const trackRef = useRef(null);
    const [pasoPx, setPasoPx] = useState(0);

    const total = items?.length || 0;
    const maxIndice = Math.max(0, total - itemsVisibles);

    const medirPaso = () => {
        const track = trackRef.current;
        const primerSlide = track?.firstElementChild;
        setPasoPx(primerSlide ? Math.round(primerSlide.getBoundingClientRect().width) + gapPx : 0);
    };

    useEffect(() => {
        medirPaso();
        window.addEventListener('resize', medirPaso);
        return () => window.removeEventListener('resize', medirPaso);
    }, [total]);

    const cambiar = (direccion) => {
        setIndiceActual((indice) => Math.min(maxIndice, Math.max(0, indice + direccion)));
    };

    useEffect(() => {
        setIndiceActual(0);
    }, [total]);

    if (!items || total === 0) {
        return mensajeVacio ? <Mensaje>{mensajeVacio}</Mensaje> : null;
    }

    return (
        <CarouselContainer>
            {titulo && (
                titulo.to ? (
                    <SeccionTitulo as={Link} to={titulo.to}>{titulo.texto}</SeccionTitulo>
                ) : (
                    <SeccionTitulo as="span">{titulo.texto}</SeccionTitulo>
                )
            )}

            <CarouselArrowsWrapper>
                <Viewport>
                    <Track
                        ref={trackRef}
                        style={{ transform: `translateX(-${pasoPx * indiceActual}px)`, gap: `${gapPx}px` }}
                    >
                        {items.map((item, index) => (
                            <Slide key={item.id ?? index} $itemsVisibles={itemsVisibles} $gapPx={gapPx}>
                                {renderItem(item, index)}
                            </Slide>
                        ))}
                    </Track>
                </Viewport>

                {total > itemsVisibles && (
                    <>
                        <Flecha type="button" $left disabled={indiceActual === 0} onClick={() => cambiar(-1)} aria-label="Anterior" />
                        <Flecha type="button" disabled={indiceActual >= maxIndice} onClick={() => cambiar(1)} aria-label="Siguiente" />
                    </>
                )}
            </CarouselArrowsWrapper>

            {total > itemsVisibles && (
                <Dots>
                    {Array.from({ length: maxIndice + 1 }, (_, indice) => (
                        <Dot
                            key={indice}
                            type="button"
                            $activo={indice === indiceActual}
                            onClick={() => setIndiceActual(indice)}
                            aria-label={`Ir a la página ${indice + 1}`}
                        />
                    ))}
                </Dots>
            )}
        </CarouselContainer>
    );
};

export default Carousel;
