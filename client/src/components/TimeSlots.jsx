import React, { useContext, useState } from 'react';
import '../styles/TimeSlots.css';
import { apiService } from '../services/genericService';
import { AuthContext } from '../context/AuthContext';

function TimeSlots({ timeSlots, setTimeSlots }) {

    const { user } = useContext(AuthContext);
    const [editingSlotId, setEditingSlotId] = useState(null);
    const [editedSlot, setEditedSlot] = useState({});

    const handleEditClick = (slot) => {
        setEditingSlotId(slot.id);
        setEditedSlot({ ...slot });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditedSlot(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = () => {
        apiService.update('timeslots', editingSlotId, {
            price: editedSlot.price,
            startTime: editedSlot.startTime,
            endTime: editedSlot.endTime
        }, () => {
            console.log("timeslot updated");

            const updatedSlots = timeSlots.map(slot =>
                slot.id === editingSlotId ? { ...slot, ...editedSlot } : slot
            );

            setEditingSlotId(null);
            setEditedSlot({});
            setTimeSlots(updatedSlots); 
        }, () => {
            console.log("timeslot error");
            alert('Error updating time slot');
        });
    };

    if (!timeSlots || timeSlots.length === 0) return null;

    return (
        <div className="parking-timeslots">
            <h3 className="timeslots-title">Available times</h3>
            <div className="timeslots-grid">
                {timeSlots.map((slot, idx) => (
                    <div key={idx} className="timeslot-card">
                        <div className="time-row">
                            <span className="label">Price:</span>
                            {editingSlotId === slot.id ? (
                                <input
                                    type="number"
                                    name="price"
                                    value={editedSlot.price}
                                    onChange={handleChange}
                                />
                            ) : (
                                <span className="value">{slot.price} ₪</span>
                            )}
                        </div>
                        <div className="time-row">
                            <span className="label">Start:</span>
                            {editingSlotId === slot.id ? (
                                <input
                                    type="time"
                                    name="startTime"
                                    value={editedSlot.startTime}
                                    onChange={handleChange}
                                />
                            ) : (
                                <span className="value">{slot.startTime}</span>
                            )}
                        </div>
                        <div className="time-row">
                            <span className="label">End:</span>
                            {editingSlotId === slot.id ? (
                                <input
                                    type="time"
                                    name="endTime"
                                    value={editedSlot.endTime}
                                    onChange={handleChange}
                                />
                            ) : (
                                <span className="value">{slot.endTime}</span>
                            )}
                        </div>

                        {user?.role == 'owner' && (
                            editingSlotId === slot.id ? (
                                <button onClick={handleSave}>Save</button>
                            ) : (
                                <button onClick={() => handleEditClick(slot)}>Edit</button>
                            )
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default TimeSlots;