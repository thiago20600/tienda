import ProductsList from "../../componentes/ProductsList/ProductsList"
import BannerCarousel from "../../componentes/BannerCarousel/BannerCarousel"
import CategoriasDestacadasCarousel from "../../componentes/CategoriasDestacadasCarousel/CategoriasDestacadasCarousel"
import ProductosOfertasCarousel from "../../componentes/ProductosOfertasCarousel/ProductosOfertasCarousel"
import ProductosDestacadosCarousel from "../../componentes/ProductosDestacadosCarousel/ProductosDestacadosCarousel"
import CambiarPagina from "../../componentes/adminpanel/tablas/CambiarPagina/CambiarPagina.jsx"
import { Link, useOutletContext, useSearchParams } from "react-router-dom"
import useProductos from "../../hooks/productos/useProductos"
import useProductosDestacados from "../../hooks/productos/useProductosDestacados"
import useCategoria from "../../hooks/categorias/useCategoria"
import SelectorOrden from "../../componentes/SelectorOrden/SelectorOrden"
import {
    CategoriaBanner,
    CategoriaBannerBg,
    CategoriaBannerOverlay,
    CategoriaBannerBreadcrumbs,
    CategoriaBannerTitle,
} from "../../componentes/ProductosPorCategoriaCarousel/ProductosPorCategoriaCarousel.styles"

const TAMANO_PAGINA = 12;

const Home = () => {

    const { query } = useOutletContext()
    const [searchParams, setSearchParams] = useSearchParams()
    const categoriaId = searchParams.get('categoria_id') || ''
    const verDestacados = searchParams.get('ver') === 'destacados'
    const verOfertas = searchParams.get('ver') === 'ofertas'
    const pagina = Number(searchParams.get('page')) || 1
    const ordenarPor = searchParams.get('ordenar_por') || ''
    const orden = searchParams.get('orden') === 'desc' ? 'desc' : 'asc'
    const hayFiltros = Boolean(query || categoriaId || verDestacados || verOfertas || ordenarPor)

    const { productos, cargando, statusError, page, pages } = useProductos(query, categoriaId, hayFiltros && !verDestacados, pagina, TAMANO_PAGINA, verOfertas, ordenarPor, orden)
    const { productos: destacados, cargando: cargandoDestacados, statusError: statusErrorDestacados } = useProductosDestacados(60, verDestacados)
    const { categoria, cargando: cargandoCategoria } = useCategoria(categoriaId)

    const actualizarParametros = (cambios) => {
        setSearchParams((previos) => {
            const siguientes = new URLSearchParams(previos)
            Object.entries(cambios).forEach(([clave, valor]) => {
                if (valor === '' || valor === null || valor === undefined) siguientes.delete(clave)
                else siguientes.set(clave, String(valor))
            })
            return siguientes
        })
    }

    const cambiarOrden = (campo, direccion) => {
        actualizarParametros({ ordenar_por: campo, orden: campo ? direccion : '', page: '' })
    }

    const cargandoActual = verDestacados ? cargandoDestacados : cargando
    const errorActual = verDestacados ? statusErrorDestacados : statusError

    if (hayFiltros && cargandoActual) return <p>Cargando productos...</p>
    if (hayFiltros && errorActual) return <p>No se pudieron cargar los productos.</p>

    return (
        <>
            {!hayFiltros && (
                <>
                    <BannerCarousel />
                    <ProductosOfertasCarousel />
                    <ProductosDestacadosCarousel />
                    <CategoriasDestacadasCarousel />
                    
                    
                </>
            )}
            {hayFiltros && (
                <>
                    {categoria && !cargandoCategoria && categoria.imagen_url?.[0] && (
                        <CategoriaBanner>
                            <CategoriaBannerBg $imagen={categoria.imagen_url[0]} />
                            <CategoriaBannerOverlay>
                                <CategoriaBannerBreadcrumbs>
                                    <Link to="/">Inicio</Link>
                                    <span>/</span>
                                    <span>{categoria.nombre}</span>
                                </CategoriaBannerBreadcrumbs>
                                <CategoriaBannerTitle>{categoria.nombre}</CategoriaBannerTitle>
                            </CategoriaBannerOverlay>
                        </CategoriaBanner>
                    )}
                    {!verDestacados && (
                        <SelectorOrden campo={ordenarPor} direccion={orden} onCambiar={cambiarOrden} />
                    )}
                    <ProductsList productos={verDestacados ? destacados : productos} />
                    {!verDestacados && (
                        <CambiarPagina
                            paginaActual={page}
                            totalPaginas={pages}
                            onPageChange={(nuevaPagina) => actualizarParametros({ page: nuevaPagina > 1 ? nuevaPagina : '' })}
                        />
                    )}
                </>
            )}
        </>
    )
}

export default Home