import React, { useEffect, useRef } from 'react';

function Payment() {
  const googlePayRef = useRef(null);

  useEffect(() => {
    const paymentsClient = new window.google.payments.api.PaymentsClient({
      environment: 'TEST', // או 'PRODUCTION' כשעוברים לאמיתי
    });

    const paymentDataRequest = {
      apiVersion: 2,
      apiVersionMinor: 0,
      allowedPaymentMethods: [{
        type: 'CARD',
        parameters: {
          allowedAuthMethods: ['PAN_ONLY', 'CRYPTOGRAM_3DS'],
          allowedCardNetworks: ['MASTERCARD', 'VISA'],
        },
        tokenizationSpecification: {
          type: 'PAYMENT_GATEWAY',
          parameters: {
            gateway: 'example', // שנה ל-gateway האמיתי שלך
            gatewayMerchantId: 'exampleMerchantId',
          },
        },
      }],
      merchantInfo: {
        merchantId: '01234567890123456789', // אם יש לך, או השאר ריק ב-'TEST'
        merchantName: 'Your Business Name',
      },
      transactionInfo: {
        totalPriceStatus: 'FINAL',
        totalPrice: '10.00',
        currencyCode: 'USD',
        countryCode: 'US',
      },
    };

    paymentsClient.isReadyToPay({
      apiVersion: 2,
      apiVersionMinor: 0,
      allowedPaymentMethods: paymentDataRequest.allowedPaymentMethods,
    }).then(function(response) {
      if (response.result) {
        const button = paymentsClient.createButton({
          onClick: () => {
            paymentsClient.loadPaymentData(paymentDataRequest).then(paymentData => {
              // כאן תשלחי את הנתונים לשרת שלך
              console.log('Payment success:', paymentData);
            }).catch(err => {
              console.error('Payment failed:', err);
            });
          }
        });
        if (googlePayRef.current) {
          googlePayRef.current.appendChild(button);
        }
      }
    }).catch(err => {
      console.error('Google Pay setup error:', err);
    });
  }, []);

  return (
    <div>
      <h1>Pay</h1>
      <div ref={googlePayRef}></div>
    </div>
  );
}

export default Payment;
