import React from 'react'
import { PayPalButtons, PayPalScriptProvider  } from '@paypal/react-paypal-js';

const PayPalButton = ({amount,onSuccess,onError}) => {
  return (
    <PayPalScriptProvider options=
    {{
      "client-id":import.meta.env.VITE_PAYPAL_CLIENT_ID,
      // "client-id": "AbFdQhp3u91AgARcHJI9etqadA3lJpSq2NVQ1WhRX3isTKSL69jZKfMXcjn44FGs4t--lIHhVHsI0rX6",
     }}>
      <PayPalButtons style={{ layout: 'vertical' }}
        createOrder={(data, actions) => {
          return actions.order.create({
            purchase_units: [
              {
                amount: {
                  value: amount,
                },
              },
            ],
          });
        }}
        onApprove={async (data, actions) => {
          return actions.order.capture().then(onSuccess);
          
        }}
        onError={onError}
      />
    </PayPalScriptProvider>
  )
}

export default PayPalButton