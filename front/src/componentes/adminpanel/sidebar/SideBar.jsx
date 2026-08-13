import { useState } from "react"
import { NavLink } from "react-router-dom"
import { SideBarContainer, ListaSeccionContainer, SeccionItem, SeccionLink } from "./SideBar.styles"

const SideBar = ({ onSeccionChange }) => {

    const sideBarSecciones = [
        {name: 'Inicio', path: '/admin'}, 
        {name: 'Pedidos', path: '/admin/pedidos'},
        {name: 'Categorias', path: '/admin/categorias'}, 
        {name: 'Productos', path: '/admin/productos'}, 
        {name: 'Configuracion', path: '/admin/configuracion'}]


    return (
        <SideBarContainer>
            <ListaSeccionContainer>
                {sideBarSecciones.map((seccion) => (
                    <SeccionItem key={seccion.name}>
                        <SeccionLink to={seccion.path} end={seccion.path === '/admin' || seccion.path === '/'}>
                            {seccion.name}
                        </SeccionLink>
                    </SeccionItem>
                ))}
            </ListaSeccionContainer>
        </SideBarContainer>
    )

}

export default SideBar