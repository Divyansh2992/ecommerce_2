import React from 'react';
import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";
const PayPalButton = ({ amount, onSuccess, onError }) => {
    return (
        <PayPalScriptProvider options={{ "client-id": "ASv_ggTnJPf3t1nDoPAf_XdrZ0-XzkHZ3boUgxbv7B1htd9SXer5DRxa97W5kQ8N9TUvXtPw0nhAMIZX" }}>
            <PayPalButtons
                style={{ layout: "vertical" }}
                createOrder={(data, actions) => {
                    return actions.order.create({
                        purchase_units: [{ amount: { value: parseFloat(amount).toFixed(2) } }]
                    });
                }}
                onApprove={(data, actions) => {
                    return actions.order.capture().then(onSuccess);
                }}
                onError={onError}
            />
        </PayPalScriptProvider>
    );
}

export default PayPalButton;
