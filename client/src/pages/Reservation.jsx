import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import Modal from '../components/Modal';
import { apiService } from '../services/genericService';

function Reservation() {
    const location = useLocation();
    const { parking, timeSlots } = location.state || {};
    const [reservationType, setReservationType] = useState('fixed');
    const [selectedSlots, setSelectedSlots] = useState([]);
    const [customStart, setCustomStart] = useState('');
    const [customEnd, setCustomEnd] = useState('');
    const [showSummary, setShowSummary] = useState(false);
    const [error, setError] = useState('');
    const [totalPrice, setTotalPrice] = useState(0);
    const paymentsClient = useRef(null);

    const onGooglePayLoaded = () => {
        paymentsClient.current = new window.google.payments.api.PaymentsClient({ environment: 'TEST' });
    };

    useEffect(() => {
        if (!window.google) {
            const script = document.createElement('script');
            script.src = 'https://pay.google.com/gp/p/js/pay.js';
            script.async = true;
            script.onload = onGooglePayLoaded;
            document.body.appendChild(script);
        } else {
            onGooglePayLoaded();
        }
    }, []);

    const paymentRequest = useMemo(() => ({
        apiVersion: 2,
        apiVersionMinor: 0,
        allowedPaymentMethods: [
            {
                type: 'CARD',
                parameters: {
                    allowedAuthMethods: ['PAN_ONLY', 'CRYPTOGRAM_3DS'],
                    allowedCardNetworks: ['MASTERCARD', 'VISA'],
                },
                tokenizationSpecification: {
                    type: 'PAYMENT_GATEWAY',
                    parameters: {
                        gateway: 'example',
                        gatewayMerchantId: 'exampleGatewayMerchantId',
                    },
                },
            },
        ],
        merchantInfo: {
            merchantId: '01234567890123456789',
            merchantName: 'Your Merchant Name',
        },
        transactionInfo: {
            totalPriceStatus: 'FINAL',
            totalPriceLabel: 'סה"כ לתשלום',
            totalPrice: totalPrice.toFixed(2),
            currencyCode: 'ILS',
            countryCode: 'IL',
        },
    }), [totalPrice]);

    const onGooglePayClicked = () => {
        paymentsClient.current.loadPaymentData(paymentRequest)
            .then(paymentData => {
                const reservationData = {
                    renterId: paymentData.renterId,  // הלקוח ששוכר
                    ownerId: paymentData.ownerId,    // הבעלים
                    timeSlotId: selectedSlots.id, // מזהה המשבצת שהוזמנה
                    totalPrice: totalPrice // סכום התשלום
                };

                apiService.create('reservation', reservationData, () => {
                    console.log('Payment Success:', paymentData);
                    alert('תשלום בוצע בהצלחה!');
                    handlePay();

                }, (error) => {
                    console.error('Payment Error:', error);

                    alert('הייתה בעיה בתשלום, נסה שוב.');
                });
            })

            .catch(err => {
                console.error('Payment Failed:', err);
                alert('הייתה בעיה בתשלום, נסה שוב.');
            });
    };

    const handleCheckboxChange = (slotId) => {
        setSelectedSlots((prev) =>
            prev.includes(slotId) ? prev.filter(id => id !== slotId) : [...prev, slotId]
        );
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (reservationType === 'custom') {
            if (!customStart || !customEnd) {
                setError('אנא בחר תאריך התחלה ותאריך סיום.');
                return;
            }
            if (new Date(customStart) >= new Date(customEnd)) {
                setError('שעת ההתחלה חייבת להיות לפני שעת הסיום.');
                return;
            }

            if (!isTimeAvailable(customStart, customEnd)) {
                setError('אין זמינות בשעות שבחרת.');
                return;
            }
        } else {
            if (selectedSlots.length === 0) {
                setError('אנא בחר לפחות זמן חניה אחד.');
                return;
            }
        }

        const price = calculatePrice();
        setTotalPrice(price);
        setError('');
        setShowSummary(true);
    };

    const isTimeAvailable = (start, end) => {
        return true;
    };

    const calculatePrice = () => {
        let total = 0;

        if (reservationType === 'custom') {
            const duration = (new Date(customEnd) - new Date(customStart)) / (1000 * 60 * 60);
            total = duration * parking.pricePerHour;
        } else {
            for (const slot of timeSlots) {
                if (selectedSlots.includes(slot.id)) {
                    const duration = (new Date(slot.endTime) - new Date(slot.startTime)) / (1000 * 60 * 60);
                    total += duration * slot.pricePerHour;
                }
            }
        }
        return total;
    };

    const handlePay = () => {
        console.log('Proceeding to payment...');
        alert('תודה על ההזמנה! התשלום בוצע בהצלחה.');
        setSelectedSlots([]);
        setShowSummary(false);
        setCustomStart('');
        setCustomEnd('');
    };

    const filteredSlots = timeSlots.filter(slot => {
        if (reservationType === 'fixed') return slot.type === 'fixed';
        if (reservationType === 'temporary') return slot.type === 'temporary';
        return false;
    });

    return (
        <div style={{ padding: '2rem' }}>
            <h2>הזמנת חניה</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>
                        <input
                            type="radio"
                            name="reservationType"
                            value="fixed"
                            checked={reservationType === 'fixed'}
                            onChange={() => setReservationType('fixed')}
                        />
                        קבועה
                    </label>
                    <label style={{ marginRight: '1rem' }}>
                        <input
                            type="radio"
                            name="reservationType"
                            value="temporary"
                            checked={reservationType === 'temporary'}
                            onChange={() => setReservationType('temporary')}
                        />
                        זמנית
                    </label>
                    <label style={{ marginRight: '1rem' }}>
                        <input
                            type="radio"
                            name="reservationType"
                            value="custom"
                            checked={reservationType === 'custom'}
                            onChange={() => setReservationType('custom')}
                        />
                        מותאמת אישית
                    </label>
                </div>

                {reservationType !== 'custom' && (
                    <>
                        <h4>בחר זמני חניה:</h4>
                        {filteredSlots.map(slot => (
                            <div key={slot.id} style={{ border: '1px solid #ccc', margin: '0.5rem 0', padding: '0.5rem' }}>
                                <label>
                                    <input
                                        type="checkbox"
                                        checked={selectedSlots.includes(slot.id)}
                                        onChange={() => handleCheckboxChange(slot.id)}
                                    />
                                    {' '}
                                    {slot.date}
                                    {' '}
                                    {slot.startTime} - {slot.endTime}
                                </label>
                            </div>
                        ))}
                    </>
                )}

                {reservationType === 'custom' && (
                    <div>
                        <label>
                            תאריך ושעת התחלה:
                            <input
                                type="datetime-local"
                                value={customStart}
                                onChange={(e) => setCustomStart(e.target.value)}
                                style={{ marginLeft: '0.5rem' }}
                            />
                        </label>
                        <br /><br />
                        <label>
                            תאריך ושעת סיום:
                            <input
                                type="datetime-local"
                                value={customEnd}
                                onChange={(e) => setCustomEnd(e.target.value)}
                                style={{ marginLeft: '0.5rem' }}
                            />
                        </label>
                    </div>
                )}

                {error && <p style={{ color: 'red' }}>{error}</p>}

                <button type="submit" style={{ marginTop: '1rem' }}>המשך לסיכום</button>
            </form>

            {showSummary && (
                <Modal onClose={() => setShowSummary(false)}>
                    <h3>סיכום ההזמנה</h3>
                    <p><strong>כתובת:</strong> {parking.address}</p>
                    {parking.description && <p><strong>הערות:</strong> {parking.description}</p>}
                    <p><strong>סכום לתשלום:</strong> {totalPrice.toFixed(2)} ₪</p>

                    {reservationType === 'custom' ? (
                        <p><strong>שעות מותאמות:</strong> {new Date(customStart).toLocaleString()} - {new Date(customEnd).toLocaleString()}</p>
                    ) : (
                        <p><strong>זמנים נבחרים:</strong> {selectedSlots.length}</p>
                    )}

                    <button
                        onClick={onGooglePayClicked}
                        style={{
                            backgroundColor: 'white',
                            borderRadius: '13px',
                            padding: '12px 24px',
                            fontSize: '16px',
                            cursor: 'pointer',
                            marginTop: '1rem'
                        }}
                    >
                        Google Pay - קנה עכשיו
                    </button>
                </Modal>
            )}
        </div>
    );
}

export default Reservation;