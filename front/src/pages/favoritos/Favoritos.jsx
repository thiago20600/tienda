import ProductCard from "../../componentes/ProductCard/ProductCard"
import useFavoritos from "../../hooks/favoritos/useFavoritos"
import { FavoritosContainer, Titulo, GrillaFavoritos, MensajeVacio, AvisoLogin } from "./Favoritos.styles"

const Favoritos = () => {
    const { favoritos, cargando, statusError, autenticado } = useFavoritos()

    if (!autenticado) {
        return (
            <FavoritosContainer>
                <Titulo>Tus favoritos</Titulo>
                <AvisoLogin>Iniciá sesión para ver tus productos favoritos.</AvisoLogin>
            </FavoritosContainer>
        )
    }

    if (cargando) return <FavoritosContainer><p>Cargando favoritos...</p></FavoritosContainer>
    if (statusError) return <FavoritosContainer><p>No se pudieron cargar tus favoritos (código: {statusError}).</p></FavoritosContainer>

    return (
        <FavoritosContainer>
            <Titulo>Tus favoritos</Titulo>

            {favoritos.length === 0 && (
                <MensajeVacio>No tenés favoritos todavía. Tocá el corazón en los productos que te gusten.</MensajeVacio>
            )}

            <GrillaFavoritos>
                {favoritos.map((favorito) => (
                    <ProductCard key={favorito.id} producto={favorito.producto} />
                ))}
            </GrillaFavoritos>
        </FavoritosContainer>
    )
}

export default Favoritos
