import { Outlet } from "react-router-dom"
import SideBar from "../../componentes/adminpanel/sidebar/SideBar"
import { LayoutAdminContainer, MainContent } from "./BaseLayoutAdmin.styles";

const BaseLayoutAdmin = () => {
    return (
        <LayoutAdminContainer>
          <SideBar />
          <MainContent>
            <Outlet />
          </MainContent>
        </LayoutAdminContainer>
  );
};


export default BaseLayoutAdmin