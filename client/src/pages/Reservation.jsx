import React, { useState, useEffect, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Modal from '../components/Modal';
import { apiService } from '../services/genericService';
import { AuthContext } from '../context/AuthContext';

function Reservation() {
    const navigate = useNavigate();
    const location = useLocation();
    const { parking, timeSlots } = location.state || {};
    const [reservationType, setReservationType] = useState('custom');
    const [selectedSlots, setSelectedSlots] = useState([]);
    const [customStart, setCustomStart] = useState('');
    const [customEnd, setCustomEnd] = useState('');
    const [showSummary, setShowSummary] = useState(false);
    const [error, setError] = useState('');
    const [totalPrice, setTotalPrice] = useState(0);
    const { user } = useContext(AuthContext);
    const [modalStep, setModalStep] = useState('initial');
    const [showPayment, setShowPayment] = useState(false);

    useEffect(() => {
        const script = document.createElement('script');
        script.src = `https://www.paypal.com/sdk/js?client-id=${import.meta.env.VITE_CLIENT_ID}&currency=ILS`;
        script.async = true;
        document.body.appendChild(script);
    }, []);

    useEffect(() => {
        setError('');
    }, [modalStep]);

    const handleCheckboxChange = (slotId) => {
        setSelectedSlots((prev) =>
            prev.includes(slotId) ? prev.filter(id => id !== slotId) : [...prev, slotId]
        );
    };

    const handleInitialNext = () => {
        setError('');
        if (!customStart || !customEnd) {
            setError('Please select a start and end time.');
            return;
        }
        if (new Date(customStart) >= new Date(customEnd)) {
            setError('End time must be after start time.');
            return;
        }
        if (!isTimeAvailable(customStart, customEnd)) {
            setModalStep('alternative');
            return;
        }

        setReservationType('custom');
        const price = calculatePrice();
        setTotalPrice(price);
        setShowSummary(true);
        setModalStep('summary');
        setError('');
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (reservationType === 'custom') {
            if (!customStart || !customEnd) {
                setError('Please select a start and end time.');
                return;
            }
            if (new Date(customStart) >= new Date(customEnd)) {
                setError('Start time must be before end time.');
                return;
            }
            if (!isTimeAvailable(customStart, customEnd)) {
                setModalStep('alternative');
                return;
            }
        } else {
            if (selectedSlots.length === 0) {
                setError('Please select at least one time slot.');
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
        return false; 
    };

    const calculatePrice = () => {
        if (reservationType === 'custom') {
            const duration = (new Date(customEnd) - new Date(customStart)) / (1000 * 60 * 60);
            return duration * parking.pricePerHour;
        }
        let total = 0;
        for (const slot of timeSlots) {
            if (selectedSlots.includes(slot.id)) {
                const [sh, sm] = slot.startTime.split(':');
                const [eh, em] = slot.endTime.split(':');
                let duration = (parseInt(eh) + parseInt(em) / 60) - (parseInt(sh) + parseInt(sm) / 60);
                if (duration < 0) duration += 24;
                total += duration * slot.price;
            }
        }
        return total;
    };

    const handlePay = () => {
        const reservationData = {
            renterId: user.id,
            ownerId: parking.ownerId,
            parkingId: parking.id,
            timeSlotId: reservationType === 'custom' ? null : selectedSlots[0],
            reservationDate: new Date().toISOString(),
            totalPrice: totalPrice
        };

        apiService.create('reservations', reservationData, () => {
            alert('The reservation has been successfully created.');
            navigate('/');
        }, (err) => {
            console.error(err);
            alert('Error creating reservation. Please try again later.');
        });
    };

const renderPayPalButton = () => {
  if (window.paypal) {
    window.paypal.Buttons({
      createOrder: (data, actions) => {
        return actions.order.create({
          purchase_units: [{ amount: { value: totalPrice.toFixed(2) } }]
        });
      },
      onApprove: async (data, actions) => {
        try {
          const details = await actions.order.capture(); // מאמת את התשלום
          const orderID = data.orderID;

          // שולחת לשרת את כל הנתונים + orderID
          await apiService.create('payments/confirm', {
            orderID,
            reservationData: {
              renterId: user.id,
              ownerId: parking.ownerId,
              parkingId: parking.id,
              timeSlotId: reservationType === 'custom' ? null : selectedSlots[0],
              reservationDate: new Date().toISOString(),
              totalPrice: totalPrice
            }
          });

          alert('Payment and reservation successful!');
          navigate('/');
        } catch (err) {
          console.error('Payment or confirmation failed:', err);
          alert('There was a problem processing the payment.');
        }
      },
      onError: err => console.error(err)
    }).render('#paypal-button-container');
  }
};


    const calculatePriceForSlot = (slot) => {
        const startDateTime = new Date(`${slot.date}T${slot.startTime}`);
        const endDateTime = new Date(`${slot.date}T${slot.endTime}`);
        const durationHours = (endDateTime - startDateTime) / (1000 * 60 * 60);
        return durationHours * slot.price;
    };

    useEffect(() => {
        if (showPayment && window.paypal) renderPayPalButton();
    }, [showPayment]);

    const filteredSlots = timeSlots.filter(slot => slot.type === reservationType);

    return (
        <Modal onClose={() => navigate(-1)}>
            {modalStep === 'initial' && (
                <div className="reservation-modal">
                    <h2>Select start and end time</h2>
                    <label>Start:
                        <input type="datetime-local" value={customStart} onChange={e => setCustomStart(e.target.value)} />
                    </label>
                    <label>End:
                        <input type="datetime-local" value={customEnd} onChange={e => setCustomEnd(e.target.value)} />
                    </label>

                    <button
                        className="switch-type-btn"
                        onClick={() => {
                            setReservationType('fixed');
                            setModalStep('fixed');
                            setError('');
                        }}
                    >
                        Fixed time slot
                    </button>

                    <h4>Available time slots</h4>
                    {timeSlots.map(slot => (
                        <div key={slot.id} className="slot-preview">{slot.date} {slot.startTime} - {slot.endTime}</div>
                    ))}

                    {error && <p className="error-text">{error}</p>}
                    <button onClick={handleInitialNext}>Continue</button>
                </div>
            )}

            {modalStep === 'fixed' && (
                <div className="reservation-modal">
                    <h3>Select fixed parking times</h3>
                    {filteredSlots.length > 0 ? (
                        filteredSlots.map(slot => (
                            <label key={slot.id}>
                                <input type="checkbox" checked={selectedSlots.includes(slot.id)} onChange={() => handleCheckboxChange(slot.id)} />
                                {slot.date} {slot.startTime} - {slot.endTime}
                            </label>
                        ))
                    ) : (
                        <p>No fixed parking times available currently.</p>
                    )}
                    {error && <p className="error-text">{error}</p>}
                    <button onClick={() => setModalStep('initial')}>Back</button>
                    {filteredSlots.length > 0 && <button onClick={handleSubmit}>Continue to summary</button>}
                </div>
            )}

            {modalStep === 'alternative' && (
                <div className="reservation-modal">
                    <h3>Parking not available at the selected time</h3>
                    <p>Try selecting one of the following available times:</p>
                    {timeSlots.map(slot => (
                        <div
                            key={slot.id}
                            className="alternative-slot"
                            onClick={() => {
                                setCustomStart(`${slot.date}T${slot.startTime}`);
                                setCustomEnd(`${slot.date}T${slot.endTime}`);
                                setReservationType('custom');
                                const price = calculatePriceForSlot(slot);
                                setTotalPrice(price);
                                setModalStep('summary');
                                setError('');
                            }}
                            style={{ cursor: 'pointer', padding: '0.5rem', borderBottom: '1px solid #ccc' }}
                        >
                            {slot.date} {slot.startTime} - {slot.endTime}
                        </div>
                    ))}
                    <button onClick={() => setModalStep('initial')}>Back</button>
                </div>
            )}

            {modalStep === 'summary' && (
                <div className="reservation-modal">
                    <h3>Reservation Summary</h3>
                    <p><strong>Address:</strong> {parking.address}</p>
                    <p><strong>Total price:</strong> {totalPrice.toFixed(2)} ₪</p>
                    <button onClick={() => setShowPayment(true)}>Proceed to payment</button>
                    {showPayment && <div id="paypal-button-container" style={{ marginTop: '1rem' }}></div>}
                    <button onClick={() => setModalStep('initial')}>Back</button>
                </div>
            )}
        </Modal>
    );
}

export default Reservation;