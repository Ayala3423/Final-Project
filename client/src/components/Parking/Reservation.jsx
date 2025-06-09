// src/pages/Reservation.jsx
import React, { useState, useEffect, useContext,  } from 'react';
import { useLocation } from 'react-router-dom';
import Modal from '../components/Ui/Modal';
import {useContext} from 'react';

function Reservation() {
    const location = useLocation();
    const { parking, timeSlots } = location.state || {};
    const [isFixed, setIsFixed] = useState(false);
    const [selectedSlots, setSelectedSlots] = useState([]);
    const [customHours, setCustomHours] = useState('');
    const [showSummary, setShowSummary] = useState(false);

    const handleCheckboxChange = (slotId) => {
        setSelectedSlots((prev) =>
            prev.includes(slotId) ? prev.filter(id => id !== slotId) : [...prev, slotId]
        );
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setShowSummary(true);
    };

    const calculatePrice = () => {
        let total = 0;
        for (const slot of timeSlots) {
            if (selectedSlots.includes(slot.id)) {
                const duration = (new Date(slot.endTime) - new Date(slot.startTime)) / (1000 * 60 * 60);
                total += duration * slot.pricePerHour;
            }
        }
        return total.toFixed(2);
    };

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
                            checked={isFixed}
                            onChange={() => setIsFixed(true)}
                        />
                        קבועה
                    </label>
                    <label style={{ marginRight: '1rem' }}>
                        <input
                            type="radio"
                            name="reservationType"
                            value="temporary"
                            checked={!isFixed}
                            onChange={() => setIsFixed(false)}
                        />
                        זמנית
                    </label>
                </div>

                <h4>בחר זמני חניה:</h4>
                {timeSlots
                    .filter(slot => (isFixed ? parking.type === 'FIXED' : true))
                    .map(slot => (
                        <div key={slot.id} style={{ border: '1px solid #ccc', margin: '0.5rem 0', padding: '0.5rem' }}>
                            <label>
                                <input
                                    type="checkbox"
                                    checked={selectedSlots.includes(slot.id)}
                                    onChange={() => handleCheckboxChange(slot.id)}
                                />
                                {' '}
                                {new Date(slot.startTime).toLocaleString()} - {new Date(slot.endTime).toLocaleString()}
                            </label>
                        </div>
                    ))}

                {!isFixed && (
                    <div>
                        <label>
                            שעות מותאמות אישית:
                            <input
                                type="text"
                                value={customHours}
                                onChange={(e) => setCustomHours(e.target.value)}
                                placeholder="למשל: 14:00-16:00"
                                style={{ marginLeft: '0.5rem' }}
                            />
                        </label>
                    </div>
                )}

                <button type="submit" style={{ marginTop: '1rem' }}>המשך לסיכום</button>
            </form>

            {showSummary && (
                <Modal onClose={() => setShowSummary(false)}>
                    <h3>סיכום ההזמנה</h3>
                    <p><strong>כתובת:</strong> {parking.address}</p>
                    {parking.description && <p><strong>הערות:</strong> {parking.description}</p>}
                    <p><strong>סכום לתשלום:</strong> {calculatePrice()} ₪</p>
                    <p><strong>שעות מותאמות:</strong> {customHours || 'ללא'}</p>
                    <button onClick={() => alert('נמשיך לתשלום בקרוב')}>מעבר לתשלום</button>
                </Modal>
            )}
        </div>
    );
}

export default Reservation;
