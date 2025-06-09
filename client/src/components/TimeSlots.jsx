import React from 'react';
import '../styles/TimeSlots.css';

function TimeSlots({ timeSlots }) {
    if (!timeSlots || timeSlots.length === 0) return null;

    return (
        <div className="parking-timeslots">
            <h3 className="timeslots-title">🕒 זמני חניה זמינים</h3>
            <div className="timeslots-grid">
                {timeSlots.map((slot, idx) => (
                    <div key={idx} className="timeslot-card">
                        <div className="time-row">
                            <span className="label">התחלה:</span>
                            <span className="value">{new Date(slot.startTime).toLocaleString()}</span>
                        </div>
                        <div className="time-row">
                            <span className="label">סיום:</span>
                            <span className="value">{new Date(slot.endTime).toLocaleString()}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default TimeSlots;
