import { useOutletContext } from "react-router-dom"

import ProductsList from "../../componentes/ProductsList/ProductsList"

const Home = () => {

    const { productos } = useOutletContext()

    return (
        <ProductsList productos={productos} />
    )
}

export default Home