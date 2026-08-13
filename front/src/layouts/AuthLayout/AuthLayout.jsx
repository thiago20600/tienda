import { Outlet } from "react-router-dom"
import { AuthLayoutContainer, AuthCard } from "./AuthLayout.styles"

const AuthLayout = () => {
    return (
        <AuthLayoutContainer>
            <AuthCard>
                <Outlet/>
            </AuthCard>
        </AuthLayoutContainer>
    )
}

export default AuthLayout