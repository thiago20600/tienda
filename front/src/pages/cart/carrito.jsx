import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { CarritoNotFound, DeleteButton, CarritoContainer, ListaItemsContainer, ItemContainer, ContenidoCarrito, ErrorMessage, StyledLink, CarritoResumen, PrecioTotal, BotonContinuarCompra, TituloCarrito, ImagenProducto, InformacionProducto, NombreProducto, DetalleProducto, AccionesProducto, PreciosProducto } from "./carrito.styles"
import ContadorCantidad from "../../componentes/ContadorCantidad/ContadorCantidad"
import PrecioProducto from "../../componentes/PrecioProducto/PrecioProducto"
import useCarrito from "../../hooks/cart/useCarrito"
import { tiendaRequest } from "../../services/api/apiClient"

const Carrito = () => {
    const navigate = useNavigate();
    const [deleteMessage, setDeleteMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [itemActualizando, setItemActualizando] = useState(null);
    const [itemEliminando, setItemEliminando] = useState(null);


    const { carrito, cargando, statusError, recargarCarrito } = useCarrito();
    const imagenFallback = 'https://res.cloudinary.com/dfnnundpn/image/upload/v1781797763/sistema_1/mirsnducpj6tdy5hjewy.jpg';
    const formatearPrecio = (precio) => `$${Number(precio).toLocaleString('es-AR', { minimumFractionDigits: 2 })}`;

    if (statusError === 404) {
        return (
            <CarritoNotFound>
                <h2>🛒 Carrito no encontrado</h2>
                <p>No pudimos encontrar tu carrito.</p>
                <button onClick={() => navigate('/')}>Ir a la tienda</button>
            </CarritoNotFound>
        )
    }

    if (cargando) {
        return <CarritoContainer><p>Cargando carrito...</p></CarritoContainer>;
    }

    if (statusError) {
        return <CarritoContainer><ErrorMessage>No se pudo cargar el carrito (código: {statusError}).</ErrorMessage></CarritoContainer>;
    }


    const modificarCantidad = async (productoId, nuevaCantidad) => {
        if (itemActualizando === productoId) return;
        setItemActualizando(productoId);
        try {
            const response = await tiendaRequest(`/mi-carrito/item/${productoId}`, {
                method: 'PATCH',
                auth: true,
                body: { cantidad: nuevaCantidad }
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
        } finally {
            setItemActualizando(null);
        }
    }

    const eliminarItemCarrito = async (productoId) => {
        if (itemEliminando === productoId) return;
        setItemEliminando(productoId);
        try {
            const response = await tiendaRequest(`/mi-carrito/${productoId}`, {
                method: 'DELETE',
                auth: true,
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
        } finally {
            setItemEliminando(null);
        }
    }

    return (
        <CarritoContainer>
            <TituloCarrito>Mi carrito</TituloCarrito>
            {carrito ? (
                <ContenidoCarrito>
                    <ListaItemsContainer>
                        {carrito.items && carrito.items.length > 0 ? (
                            carrito.items.map((item) => (
                                <ItemContainer key={item.id}>
                                    <ImagenProducto src={item.producto.imagen_url?.[0] || imagenFallback} alt={item.producto.nombre} />
                                    <InformacionProducto>
                                        <StyledLink to={`/productos/${item.producto_id}`}>
                                            <NombreProducto>{item.producto.nombre}</NombreProducto>
                                        </StyledLink>
                                        <DetalleProducto>Precio unitario</DetalleProducto>
                                        <PrecioProducto precio={item.producto.precio} precioDescuento={item.precio_unitario} compacto />
                                        <DetalleProducto>Stock disponible: {item.producto.stock}</DetalleProducto>
                                    </InformacionProducto>
                                    <AccionesProducto>
                                        <ContadorCantidad 
                                            stockMaximo={item.producto.stock + item.cantidad} 
                                            valorInicial={item.cantidad} 
                                            disabled={itemActualizando === item.producto_id || itemEliminando === item.producto_id}
                                            onChange={(nueva) => modificarCantidad(item.producto_id, nueva)}
                                        />
                                        <PreciosProducto>
                                            <span>Subtotal</span>
                                            <span>{formatearPrecio(item.subtotal)}</span>
                                        </PreciosProducto>
                                    </AccionesProducto>
                                    <DeleteButton disabled={itemEliminando === item.producto_id || itemActualizando === item.producto_id} onClick={() => eliminarItemCarrito(item.producto_id)} aria-label={`Eliminar ${item.producto.nombre}`}>🗑️</DeleteButton>
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
                <p>{errorMessage || "No hay información del carrito."}</p>
            )}
            
            {(errorMessage || deleteMessage) && (
                <ErrorMessage>{errorMessage || deleteMessage}</ErrorMessage>
            )}
        </CarritoContainer>
    );
};

export default Carrito;