import { Outlet } from "react-router-dom"
import { CheckoutLayoutContainer, CheckoutCard } from "./CheckoutLayout.styles"

const CheckoutLayout = () => {
    return (
        <CheckoutLayoutContainer>
            <CheckoutCard>
                <Outlet />
            </CheckoutCard>
        </CheckoutLayoutContainer>
    )
}

export default CheckoutLayout