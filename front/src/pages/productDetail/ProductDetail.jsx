import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import ProductDetailCard from "../../componentes/ProductDetailCard/ProductDetailCard"
import { ProductDetailStyle, ProductDetailWrapper } from "./ProductDetail.styles"
import AddToCartProduct from "../../componentes/AddToCartProduct/AddToCartProduct"
import { tiendaRequest } from "../../services/api/apiClient"

const ProductDetail = () => {

    const { id } = useParams()
    const [producto, setProducto] = useState(null)
    const [error, setError] = useState(false)

    useEffect(() => {

    const obtenerProducto = async () => {

        try {
        const respuesta = await tiendaRequest(`/productos/${id}`)

        if (!respuesta.ok) {
            setProducto(false)
            return
        }

        const data = await respuesta.json()

        setProducto(data)
        } catch (requestError) {
            console.error('Error cargando producto:', requestError)
            setError(true)
        }
    }

    obtenerProducto()

    }, [id])

    if (producto === null && !error) {
    return <p>Cargando...</p>
    }

    if (error || producto === false) {
        return <p>Producto no encontrado</p>
    }

    return (
        <ProductDetailWrapper>
            <ProductDetailStyle>
            <ProductDetailCard producto={producto} />
            <AddToCartProduct producto={producto} />
            </ProductDetailStyle>
        </ProductDetailWrapper>
    );

}

export default ProductDetail