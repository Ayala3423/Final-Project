import React from 'react';
import '../styles/TimeSlots.css';

function TimeSlots({ timeSlots }) {
    if (!timeSlots || timeSlots.length === 0) return null;

    return (
        <div className="parking-timeslots">
            <h3 className="timeslots-title">Availible times</h3>
            <div className="timeslots-grid">
                {timeSlots.map((slot, idx) => (
                    <div key={idx} className="timeslot-card">
                        <div className="time-row">
                            <span className="label">Price:</span>
                            <span className="value">{slot.price} ₪</span>
                        </div>
                        <div className="time-row">
                            <span className="label">Start:</span>
                            <span className="value">{slot.startTime}</span>
                        </div>
                        <div className="time-row">
                            <span className="label">End:</span>
                            <span className="value">{slot.endTime}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default TimeSlots;