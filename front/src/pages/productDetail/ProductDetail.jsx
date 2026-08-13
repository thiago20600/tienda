import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import ProductDetailCard from "../../componentes/ProductDetailCard/ProductDetailCard"
import { ProductDetailStyle, ProductDetailWrapper } from "./ProductDetail.styles"
import AddToCartProduct from "../../componentes/AddToCartProduct/AddToCartProduct"

const ProductDetail = () => {

    const { id } = useParams()
    const UrlApiBase = import.meta.env.VITE_API_URL
    const [producto, setProducto] = useState(null)

    useEffect(() => {

    const obtenerProducto = async () => {

        const respuesta = await fetch(`${UrlApiBase}/productos/${id}`)

        if (!respuesta.ok) {
            setProducto(false)
            return
        }

        const data = await respuesta.json()

        setProducto(data)
    }

    obtenerProducto()

    }, [id])

    if (producto === null) {
    return <p>Cargando...</p>
    }

    if (producto === false) {
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