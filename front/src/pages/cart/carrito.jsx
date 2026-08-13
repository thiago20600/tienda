import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { CarritoNotFound, DeleteButton, CarritoContainer, ListaItemsContainer, ItemContainer, AtributoItem, ContenidoCarrito, ErrorMessage, StyledLink, CarritoResumen, PrecioTotal, BotonContinuarCompra } from "./carrito.styles"
import ContadorCantidad from "../../componentes/ContadorCantidad/ContadorCantidad"
import useCarrito from "../../hooks/cart/useCarrito"

const Carrito = () => {
    const UrlApiBaseProductos = import.meta.env.VITE_API_URL;
    const navigate = useNavigate();
    const [deleteMessage, setDeleteMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');


    const { carrito, cargando, statusError, message, recargarCarrito } = useCarrito();

    if (statusError === 404) {
        return (
            <CarritoNotFound style={{ textAlign: 'center', padding: '40px' }}>
                <h2>🛒 Carrito no encontrado</h2>
                <p>No pudimos encontrar tu carrito.</p>
                <button onClick={() => navigate('/')}>Ir a la tienda</button>
            </CarritoNotFound>
        )
    }


    const modificarCantidad = async (productoId, nuevaCantidad) => {
        const accessToken = localStorage.getItem('token');
        
        try {
            const response = await fetch(`${UrlApiBaseProductos}/mi-carrito/item/${productoId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                },
                body: JSON.stringify({ cantidad: nuevaCantidad })
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                console.error("Error al actualizar:", errorData);
                setErrorMessage(errorData.detail);
                return;
            }


            await recargarCarrito();
            setErrorMessage('');
        } catch (error) {
            console.error("Error de red al modificar cantidad:", error);
            setErrorMessage("Error de conexión al actualizar la cantidad.");
        }
    }

    const eliminarItemCarrito = async (productoId) => {
        const accessToken = localStorage.getItem('token');

        try {
            const response = await fetch(`${UrlApiBaseProductos}/mi-carrito/${productoId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                },
            });

            const data = await response.json();

            if (!response.ok) {
                setDeleteMessage(data.detail);
            } else {
                setDeleteMessage('Producto eliminado del carrito');
                await recargarCarrito();
            }
        } catch (error) {
            console.error("Error de red al eliminar producto:", error);
            setDeleteMessage("Error al intentar eliminar el producto.");
        }
    }

    return (
        <CarritoContainer>
            {carrito ? (
                <ContenidoCarrito>
                    <ListaItemsContainer>
                        {carrito.items && carrito.items.length > 0 ? (
                            carrito.items.map((item) => (
                                <ItemContainer key={item.id}>
                                    <DeleteButton onClick={() => eliminarItemCarrito(item.producto_id)}>🗑️</DeleteButton>
                                    <StyledLink to={`/productos/${item.producto_id}`}>
                                        <AtributoItem>producto: {item.producto.nombre}</AtributoItem>
                                    </StyledLink>
                                    <ContadorCantidad 
                                        stockMaximo={item.producto.stock + item.cantidad} 
                                        valorInicial={item.cantidad} 
                                        onChange={(nueva) => modificarCantidad(item.producto_id, nueva)}
                                    />
                                    <AtributoItem>precio: {item.precio_unitario.toLocaleString('es-AR')}</AtributoItem>
                                    <AtributoItem>subtotal: {item.subtotal.toLocaleString('es-AR')}</AtributoItem>
                                </ItemContainer>
                            ))
                                
                        ) : (
                            <p>Tu carrito está vacío.</p>
                        )}
                    </ListaItemsContainer>
                    {carrito.items && carrito.items.length > 0 && (
                        <CarritoResumen>
                                        <p>Resumen de compra</p>
                                        <PrecioTotal>${carrito.total ? carrito.total.toLocaleString('es-AR') : 0}</PrecioTotal>
                                        <BotonContinuarCompra onClick={() => { navigate('/checkout') }}>Continuar</BotonContinuarCompra>
                        </CarritoResumen>
                    )}
                </ContenidoCarrito>
            ) : (
                <p>{errorMessage || "Cargando carrito..."}</p>
            )}
            
            {(message || errorMessage || deleteMessage) && (
                <ErrorMessage>{errorMessage || deleteMessage || message}</ErrorMessage>
            )}
        </CarritoContainer>
    );
};

export default Carrito;