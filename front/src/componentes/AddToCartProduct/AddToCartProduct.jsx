import { useState } from "react"
import { AddToCartContainer, PrecioProducto, AgregarProductoBoton } from "./AddToCartProduct.styles"
import ContadorCantidad from "../ContadorCantidad/ContadorCantidad"
import { useNavigate } from "react-router-dom"
import { tiendaRequest } from "../../services/api/apiClient"

const AddToCartProduct = ({ producto }) => {

    const [cantidad, setCantidad] = useState(1)
    const [message, setMessage] = useState('')
    const navigate = useNavigate()

    const addToCart = async () => {

        try{
        const response = await tiendaRequest(`/mi-carrito/${producto.id}`,{
                                        method: 'PATCH',
                                        auth: true,
                                        body: {cantidad: cantidad}}
                                    )


                                        if (!response.ok) {
                                            const errorData = await response.json()
                                            setMessage(errorData.detail)
                                            if (response.status === 401){
                                                navigate('/login/')
                                                }
                                            
                                            return
                                            }
                                        
                                        await response.json()
                                        setMessage("¡Producto agregado con éxito!")

                                    } catch (error) {
                                        console.error('Error de red al agregar al carrito:', error)
                                        setMessage('Error de conexión al agregar el producto.')
                                    }

    }

    return (
        <AddToCartContainer>
            <PrecioProducto>{producto.precio.toLocaleString('es-AR')}</PrecioProducto>
            <p>cantidad</p>
            <ContadorCantidad valorInicial={1} stockMaximo={producto.stock} onChange={(nuevaCantidad) => setCantidad(nuevaCantidad)}>editar cantidad</ContadorCantidad>
            <AgregarProductoBoton onClick={addToCart}>agregar al carrito</AgregarProductoBoton>
            {message && <p>{message}</p>}
        </AddToCartContainer>
    )
}


export default AddToCartProduct