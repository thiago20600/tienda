import { useState } from "react"
import { AddToCartContainer, AgregarProductoBoton } from "./AddToCartProduct.styles"
import ContadorCantidad from "../ContadorCantidad/ContadorCantidad"
import { useNavigate } from "react-router-dom"
import { tiendaRequest } from "../../services/api/apiClient"
import PrecioProducto from "../PrecioProducto/PrecioProducto"

const AddToCartProduct = ({ producto }) => {

    const [cantidad, setCantidad] = useState(1)
    const [message, setMessage] = useState('')
    const navigate = useNavigate()

    const addToCart = async () => {
            try {
                const response = await tiendaRequest(`/mi-carrito/${producto.id}`, {
                    method: 'PATCH',
                    auth: true,
                    body: { cantidad: cantidad }
                })

                const data = await response.json()

                if (!response.ok) {
                    setMessage(typeof data.detail === 'string' ? data.detail : 'Error al agregar el producto')

                    if (response.status === 401) {
                        navigate('/login/')
                    }

                    return
                }

                setMessage("¡Producto agregado con éxito!")

            } catch (error) {
                console.error('ERROR REAL:', error)
                console.error('ERROR MESSAGE:', error.message)
                setMessage(error.message)
            }

    }

    return (
        <AddToCartContainer>
            <PrecioProducto precio={producto.precio} precioDescuento={producto.precio_descuento} />
            <p>cantidad</p>
            <ContadorCantidad valorInicial={1} stockMaximo={producto.stock} onChange={(nuevaCantidad) => setCantidad(nuevaCantidad)}>editar cantidad</ContadorCantidad>
            <p>disponibles: {producto.stock}</p>
            <AgregarProductoBoton onClick={addToCart}>agregar al carrito</AgregarProductoBoton>
            {message && <p>{message}</p>}
        </AddToCartContainer>
    )
}


export default AddToCartProduct