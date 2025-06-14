import React, { useState, useEffect, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Modal from '../components/Modal';
import { apiService } from '../services/genericService';
import { AuthContext } from '../context/AuthContext';

function Reservation() {
    const navigate = useNavigate();
    const location = useLocation();
    const { parking, timeSlots } = location.state || {};
    const [reservationType, setReservationType] = useState('fixed');
    const [selectedSlots, setSelectedSlots] = useState([]);
    const [customStart, setCustomStart] = useState('');
    const [customEnd, setCustomEnd] = useState('');
    const [showSummary, setShowSummary] = useState(false);
    const [error, setError] = useState('');
    const [totalPrice, setTotalPrice] = useState(0);
    const [showPayment, setShowPayment] = useState(false);
    const { user } = useContext(AuthContext);
    const [showTypeModal, setShowTypeModal] = useState(true); 
    const [modalStep, setModalStep] = useState('selectType');

    useEffect(() => {
        const script = document.createElement('script');

        script.src = `https://www.paypal.com/sdk/js?client-id=${import.meta.env.VITE_CLIENT_ID}&currency=ILS`;
        script.async = true;
        document.body.appendChild(script);
    }, []);

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
        setModalStep('summary');

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
                console.log(`Calculating price for slot ${JSON.stringify(slot)}`);
                const [startHour, startMin, startSec] = slot.startTime.split(':').map(Number);
                const [endHour, endMin, endSec] = slot.endTime.split(':').map(Number);
                if (selectedSlots.includes(slot.id)) {

                    let duration = (endHour + endMin / 60 + endSec / 3600) - (startHour + startMin / 60 + startSec / 3600);
                    if (duration < 0) {
                        // למשל חניה שעוברת חצות, מוסיפים 24 שעות
                        duration += 24;
                    } console.log(`Slot ${slot.id} duration: ${duration} hours`);

                    total += duration * slot.price;
                }
            }
        }
        console.log(`Calculated total price: ${total}`);

        return total;
    };

    const handlePay = () => {
        console.log("ppp", parking, parking.ownerId);

        const reservationData = {
            renterId: user.id,
            ownerId: parking.ownerId,
            parkingId: parking.id,
            timeSlotId: 1,
            //reservationType: reservationType,
            // selectedSlots: reservationType !== 'custom' ? selectedSlots : [],
            reservationDate: new Date().toISOString(),
            // customStart: reservationType === 'custom' ? customStart : null,
            // customEnd: reservationType === 'custom' ? customEnd : null,
            totalPrice: totalPrice
        };

        apiService.create('reservation', reservationData, () => {
            alert('תודה על ההזמנה! התשלום בוצע בהצלחה.');
            setSelectedSlots([]);
            setShowSummary(false);
            setCustomStart('');
            setCustomEnd('');
        }, (error) => {
            console.error('Error creating reservation:', error);
            alert('הייתה בעיה ביצירת ההזמנה, נסה שוב.');
        });
    };

    const renderPayPalButton = () => {
        if (window.paypal) {
            window.paypal.Buttons({
                createOrder: (data, actions) => {
                    return actions.order.create({
                        purchase_units: [{
                            amount: {
                                value: totalPrice.toFixed(2)
                            }
                        }]
                    });
                },
                onApprove: (data, actions) => {
                    return actions.order.capture().then(() => {
                        handlePay();
                    });
                },
                onError: (err) => {
                    console.error('PayPal Error:', err);
                    alert('הייתה בעיה בתשלום דרך PayPal, נסה שוב.');
                }
            }).render('#paypal-button-container');
        }
    };

    useEffect(() => {
        if (showPayment && window.paypal) {
            renderPayPalButton();
        }
    }, [showPayment]);

    const filteredSlots = timeSlots.filter(slot => {
        if (reservationType === 'fixed') return slot.type === 'fixed';
        if (reservationType === 'temporary') return slot.type === 'temporary';
        return false;
    });

    const handleCloseModal = () => {
        setShowTypeModal(false);
        navigate(-1); 
    };

    return (
        <>
            {showTypeModal && (
                <Modal onClose={() => handleCloseModal()}>
                    {modalStep === 'selectType' && (
                        <>
                            <h3>בחר סוג הזמנה</h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <button onClick={() => { setReservationType('fixed'); setModalStep('form'); }}>קבועה</button>
                                <button onClick={() => { setReservationType('temporary'); setModalStep('form'); }}>זמנית</button>
                                <button onClick={() => { setReservationType('custom'); setModalStep('form'); }}>מותאמת אישית</button>
                            </div>
                        </>
                    )}

                    {modalStep === 'form' && (
                        <form onSubmit={handleSubmit}>
                            {reservationType !== 'custom' && (
                                <>
                                    <h4>בחר זמני חניה:</h4>
                                    {filteredSlots.map(slot => (
                                        <div key={slot.id}>
                                            <label>
                                                <input
                                                    type="checkbox"
                                                    checked={selectedSlots.includes(slot.id)}
                                                    onChange={() => handleCheckboxChange(slot.id)}
                                                />
                                                {' '}
                                                {slot.date} {slot.startTime} - {slot.endTime}
                                            </label>
                                        </div>
                                    ))}
                                </>
                            )}

                            {reservationType === 'custom' && (
                                <div>
                                    <label>
                                        התחלה:
                                        <input
                                            type="datetime-local"
                                            value={customStart}
                                            onChange={(e) => setCustomStart(e.target.value)}
                                        />
                                    </label>
                                    <br />
                                    <label>
                                        סיום:
                                        <input
                                            type="datetime-local"
                                            value={customEnd}
                                            onChange={(e) => setCustomEnd(e.target.value)}
                                        />
                                    </label>
                                </div>
                            )}

                            {error && <p style={{ color: 'red' }}>{error}</p>}
                            <button type="submit" style={{ marginTop: '1rem' }}>המשך לסיכום</button>
                        </form>
                    )}

                    {modalStep === 'summary' && (
                        <>
                            <h3>סיכום ההזמנה</h3>
                            <p><strong>כתובת:</strong> {parking.address}</p>
                            {parking.description && <p><strong>הערות:</strong> {parking.description}</p>}
                            <p><strong>סכום לתשלום:</strong> {totalPrice.toFixed(2)} ₪</p>

                            {reservationType === 'custom' ? (
                                <p><strong>שעות מותאמות:</strong> {new Date(customStart).toLocaleString()} - {new Date(customEnd).toLocaleString()}</p>
                            ) : (
                                <p><strong>זמנים נבחרים:</strong> {selectedSlots.length}</p>
                            )}

                            {!showPayment && (
                                <button onClick={() => setShowPayment(true)} style={{ marginTop: '1rem' }}>
                                    לתשלום
                                </button>
                            )}

                            {showPayment && (
                                <div id="paypal-button-container" style={{ marginTop: '1rem' }}></div>
                            )}
                        </>
                    )}
                </Modal>
            )}

        </>
    );
}

export default Reservation;