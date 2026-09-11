import { Outlet } from "react-router-dom"
import { ThemeProvider } from "styled-components"
import SideBar from "../../componentes/adminpanel/sidebar/SideBar"
import HeaderAdmin from "../../componentes/adminpanel/header/HeaderAdmin"
import { LayoutAdminContainer, MainContent } from "./BaseLayoutAdmin.styles"
import useAdminColores from "../../hooks/configuracion/useAdminColores"

const BaseLayoutAdmin = () => {
    const { configuracion } = useAdminColores()

    const theme = {
        primary: configuracion?.color_primario || '#009ee3',
        secondary: configuracion?.color_secundario || '#0081b8'
    }

    return (
        <ThemeProvider theme={theme}>
            <LayoutAdminContainer>
                <SideBar />
                <MainContent>
                    <HeaderAdmin />
                    <Outlet />
                </MainContent>
            </LayoutAdminContainer>
        </ThemeProvider>
    )
}

export default BaseLayoutAdmin