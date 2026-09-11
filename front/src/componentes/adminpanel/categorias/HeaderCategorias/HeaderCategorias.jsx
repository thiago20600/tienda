import { useState } from "react"
import Buscador from "../../Buscador/Buscador"
import { HeaderContainer } from "../../productos/productosHeader/ProductosHeader.styles"
import useCrearCategoria from "../../../../hooks/categorias/useCrearCategoria"
import { AgregarCategoria } from "./HeaderCategorias.styles"
import AdminButton from "../../ui/AdminButton/AdminButton"

const HeaderCategorias = ({ onCategoriaCreada }) => {
    const { crearCategoria } = useCrearCategoria()
    const [instanciaCrearCategoria, setInstanciaCrearCategoria] = useState(false)  
    const [nombreCategoria, setNombreCategoria] = useState('')
    const handleInputChange = (e) => {setNombreCategoria(e.target.value)}
    
    
    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!nombreCategoria.trim()) return

        const response = await crearCategoria({'nombre': nombreCategoria})

        if (response){
            setNombreCategoria('')
            setInstanciaCrearCategoria(false)
            if (onCategoriaCreada){
                onCategoriaCreada(nombreCategoria)
            }
        }
        setNombreCategoria('');
        setInstanciaCrearCategoria(false);
        window.location.reload()
        
    }


    return (
    <HeaderContainer>
        
        <Buscador></Buscador>
        <AdminButton onClick={() => {setInstanciaCrearCategoria(true)}}>Crear categoria</AdminButton>

        {instanciaCrearCategoria &&
         <AgregarCategoria>
            <p>Crear categoria</p>
            <button onClick={() => {setInstanciaCrearCategoria(false)}}>X</button>
            <form onSubmit={handleSubmit}>
                <label htmlFor='nombreCategoria'>categoria:</label>
                <input id='nombreCategoria' type="text" placeholder="nombre" onChange={handleInputChange} value={nombreCategoria}></input>
                <AdminButton type='submit'>Guardar</AdminButton>
            </form>
            
         </AgregarCategoria> 
         }
        
    </HeaderContainer>

    )
}
export default HeaderCategorias