import { useState } from "react"
import { AddToCartContainer, PrecioProducto, AgregarProductoBoton } from "./AddToCartProduct.styles"
import ContadorCantidad from "../ContadorCantidad/ContadorCantidad"
import { useNavigate } from "react-router-dom"

const AddToCartProduct = ({ producto }) => {

    const UrlApiBaseUsuarios = import.meta.env.VITE_API_URL_USUARIOS
    const UrlApiBaseProductos = import.meta.env.VITE_API_URL
    const [cantidad, setCantidad] = useState(1)
    const [message, setMessage] = useState('')
    const navigate = useNavigate()

    const addToCart = async () => {

        const token = localStorage.getItem('token')

        try{
        const response = await fetch(`${UrlApiBaseProductos}/mi-carrito/${producto.id}`,{
                                        method: 'PATCH',
                                        headers: {
                                            'Content-Type': 'application/json',
                                            'Authorization': `Bearer ${token}`
                                        },
                                        body: JSON.stringify({cantidad: cantidad})}
                                    )


                                        if (!response.ok) {
                                            const errorData = await response.json()
                                            setMessage(errorData.detail)
                                            if (response.status === 401){
                                                navigate('/login/')
                                                }
                                            
                                            return
                                            }
                                        
                                        const carritoActualizado = await response.json()
                                        setMessage("¡Producto agregado con éxito!")

                                    } catch (error) {
                                        setMessage(error.detail)
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