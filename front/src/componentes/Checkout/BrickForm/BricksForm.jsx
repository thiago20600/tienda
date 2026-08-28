import { CardPayment } from "@mercadopago/sdk-react"

const BricksForm = ({ amount, paymentId, onSubmit }) => {
    return (
        <>
            {!paymentId && amount?.amount && (
                <CardPayment
                    initialization={amount}
                    onSubmit={onSubmit}
                />
            )}
        </>
    )
}

export default BricksForm