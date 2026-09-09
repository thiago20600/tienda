import { useEffect, useState } from "react"
import ProductsList from "../../componentes/ProductsList/ProductsList"
import BannerCarousel from "../../componentes/BannerCarousel/BannerCarousel"
import CategoriasDestacadasCarousel from "../../componentes/CategoriasDestacadasCarousel/CategoriasDestacadasCarousel"
import ProductosDestacadosCarousel from "../../componentes/ProductosDestacadosCarousel/ProductosDestacadosCarousel"
import CambiarPagina from "../../componentes/adminpanel/tablas/CambiarPagina/CambiarPagina.jsx"
import { useOutletContext } from "react-router-dom"
import useProductos from "../../hooks/productos/useProductos"
import useProductosDestacados from "../../hooks/productos/useProductosDestacados"
import { useSearchParams } from "react-router-dom"

const TAMANO_PAGINA = 12;

const Home = () => {

    const { query } = useOutletContext()
    const [searchParams] = useSearchParams()
    const categoriaId = searchParams.get('categoria_id') || ''
    const verDestacados = searchParams.get('ver') === 'destacados'
    const hayFiltros = Boolean(query || categoriaId || verDestacados)

    const [pagina, setPagina] = useState(1)
    const { productos, cargando, statusError, page, pages, cambiarPagina } = useProductos(query, categoriaId, hayFiltros && !verDestacados, pagina, TAMANO_PAGINA)
    const { productos: destacados, cargando: cargandoDestacados, statusError: statusErrorDestacados } = useProductosDestacados(60, verDestacados)

    useEffect(() => {
        setPagina(1)
    }, [query, categoriaId, verDestacados])

    const cargandoActual = verDestacados ? cargandoDestacados : cargando
    const errorActual = verDestacados ? statusErrorDestacados : statusError

    if (hayFiltros && cargandoActual) return <p>Cargando productos...</p>
    if (hayFiltros && errorActual) return <p>No se pudieron cargar los productos.</p>

    return (
        <>
            {!hayFiltros && (
                <>
                    <BannerCarousel />
                    <CategoriasDestacadasCarousel />
                    <ProductosDestacadosCarousel />
                </>
            )}
            {hayFiltros && (
                <>
                    <ProductsList productos={verDestacados ? destacados : productos} />
                    {!verDestacados && (
                        <CambiarPagina
                            paginaActual={page}
                            totalPaginas={pages}
                            onPageChange={(nuevaPagina) => {
                                setPagina(nuevaPagina)
                                cambiarPagina(nuevaPagina)
                            }}
                        />
                    )}
                </>
            )}
        </>
    )
}

export default Home