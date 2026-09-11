import { BotonCorazon } from "./BotonFavorito.styles";
import { useAuth } from "../../services/auth/useAuth";
import { useFavoritos } from "../../services/favoritos/FavoritosContext";

const BotonFavorito = ({ productoId }) => {
    const { usuario } = useAuth();
    const { esFavorito, alternar } = useFavoritos();

    if (!usuario) return null;

    const activo = esFavorito(productoId);

    return (
        <BotonCorazon
            type="button"
            $activo={activo}
            aria-label={activo ? "Quitar de favoritos" : "Agregar a favoritos"}
            title={activo ? "Quitar de favoritos" : "Agregar a favoritos"}
            onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();
                alternar(productoId);
            }}
        >
            {activo ? "♥" : "♡"}
        </BotonCorazon>
    );
};

export default BotonFavorito;
