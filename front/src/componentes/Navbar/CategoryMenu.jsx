import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import useCategorias from '../../hooks/categorias/useCategorias';
import {
    CategoryMenuContainer,
    CategoryMenuButton,
    CategoryMenuPanel,
    CategoryMenuGrid,
    CategoryLink,
    CategoryMenuAll
} from './CategoryMenu.styles';

const CategoryMenu = () => {
    const { categorias, cargando } = useCategorias();
    const [abierto, setAbierto] = useState(false);
    const menuRef = useRef(null);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (!abierto) return undefined;

        const cerrarMenu = (event) => {
            if (!menuRef.current?.contains(event.target)) setAbierto(false);
        };
        const cerrarConEscape = (event) => {
            if (event.key === 'Escape') setAbierto(false);
        };

        document.addEventListener('mousedown', cerrarMenu);
        document.addEventListener('keydown', cerrarConEscape);
        return () => {
            document.removeEventListener('mousedown', cerrarMenu);
            document.removeEventListener('keydown', cerrarConEscape);
        };
    }, [abierto]);

    const seleccionarCategoria = (categoriaId) => {
        const parametros = new URLSearchParams();
        parametros.set('categoria_id', categoriaId);
        navigate(`/?${parametros.toString()}`);
        setAbierto(false);
    };

    const limpiarCategoria = () => {
        navigate('/');
        setAbierto(false);
    };

    return (
        <CategoryMenuContainer ref={menuRef}>
            <CategoryMenuButton
                type="button"
                $activo={location.search.includes('categoria_id')}
                onClick={() => setAbierto((actual) => !actual)}
                aria-expanded={abierto}
                aria-haspopup="true"
            >
                Categorías <span aria-hidden="true">⌄</span>
            </CategoryMenuButton>
            {abierto && (
                <CategoryMenuPanel>
                    <CategoryMenuAll>
                        <CategoryLink as="button" type="button" onClick={limpiarCategoria} $destacada>
                            Todas las categorías
                        </CategoryLink>
                    </CategoryMenuAll>
                    {cargando ? (
                        <p>Cargando categorías...</p>
                    ) : (
                        <CategoryMenuGrid>
                            {categorias.filter((categoria) => categoria.estado).map((categoria) => (
                                <CategoryLink
                                    as="button"
                                    type="button"
                                    key={categoria.id}
                                    onClick={() => seleccionarCategoria(categoria.id)}
                                >
                                    {categoria.nombre}
                                </CategoryLink>
                            ))}
                        </CategoryMenuGrid>
                    )}
                </CategoryMenuPanel>
            )}
        </CategoryMenuContainer>
    );
};

export default CategoryMenu;
