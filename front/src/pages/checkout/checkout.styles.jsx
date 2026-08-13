import styled from 'styled-components';

export const CheckoutWrapper = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  padding: 24px 16px;
  box-sizing: border-box;
  /*background-color: #f5f5f5;*/
  min-height: 100vh;
`;

export const PaymentGrid = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 540px;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.1);
  padding: 24px;
  box-sizing: border-box;
  gap: 20px;
`;

export const AmountText = styled.p`
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  font-size: 18px;
  font-weight: 600;
  color: #333333;
  margin: 0;
  padding-bottom: 16px;
  border-bottom: 1px solid #ededed; /* Separador sutil abajo del total */
`;


export const PagoExitosoContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.1);
  padding: 32px 24px;
  max-width: 480px;
  margin: 40px auto;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;

  h2 {
    color: #00a650; /* Verde éxito de Mercado Pago */
    font-size: 22px;
    font-weight: 600;
    margin: 0 0 12px 0;
  }

  p {
    color: #333333;
    font-size: 15px;
    margin: 0 0 24px 0;

    strong {
      margin-right: 6px;
      font-weight: 600;
    }
  }

  button {
    width: 100%;
    height: 48px;
    background-color: #009ee3; /* Azul primario */
    color: #ffffff;
    border: none;
    border-radius: 6px;
    font-size: 15px;
    font-weight: 600;
    cursor: pointer;
    transition: background-color 0.2s ease-in-out;

    &:hover {
      background-color: #0081b8;
    }

    &:active {
      background-color: #006895;
    }
  }
`;


