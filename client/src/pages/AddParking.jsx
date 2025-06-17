import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { apiService } from '../services/genericService';
import '../styles/AddParking.css';

const weekdays = ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת'];

function AddParkingForm() {
    const { user } = useContext(AuthContext);
    const [parking, setParking] = useState({
        address: '',
        description: '',
        isAllowSubReservations: false
    });

    const [imageFile, setImageFile] = useState(null);
    const [availability, setAvailability] = useState([
        {
            type: 'קבוע', // 'קבוע' או 'זמני'
            days: [],
            startTime: '',
            endTime: ''
        }
    ]);

    const handleChange = (e) => {
        setParking({ ...parking, [e.target.name]: e.target.value });
    };

    const handleImageChange = (e) => {
        setImageFile(e.target.files[0]);
    };

    const handleAvailabilityChange = (index, field, value) => {
        const updated = [...availability];
        updated[index][field] = value;
        setAvailability(updated);
    };

    const toggleDay = (index, day) => {
        const updated = [...availability];
        const days = updated[index].days;
        updated[index].days = days.includes(day)
            ? days.filter(d => d !== day)
            : [...days, day];
        setAvailability(updated);
    };

    const addAvailability = () => {
        setAvailability([
            ...availability,
            { type: 'קבוע', days: [], startTime: '', endTime: '' }
        ]);
    };

    const removeAvailability = (index) => {
        const updated = [...availability];
        updated.splice(index, 1);
        setAvailability(updated);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const formData = new FormData();
            formData.append('address', parking.address);
            formData.append('description', parking.description);
            formData.append('ownerId', user.id);
            formData.append('isAllowSubReservations', parking.isAllowSubReservations);
            if (imageFile) {
                formData.append('image', imageFile);
            }

            apiService.create('parkings', formData, (res) => {
                console.log("Parking added successfully:", res);
                const parkingId = res.data.id;
                apiService.create('availability', {
                    parkingId,
                    slots: availability
                });
            }, (error) => {
                console.error("Error adding parking:", error)
            });

            alert('החניה נוספה בהצלחה!');
        } catch (error) {
            console.error("Failed to add parking or availability", error);
        }
    };

    return (
        <form className="parking-form" onSubmit={handleSubmit}>
            <label>
                Address:
                <input name="address" value={parking.address} onChange={handleChange} required />
            </label>

            <label>
                Picture:
                <input type="file" name="image" accept="image/*" onChange={handleImageChange} />
            </label>

            <label>
                Description:
                <textarea name="description" value={parking.description} onChange={handleChange} />
            </label>
            <label>
                <input
                    type="checkbox"
                    checked={parking.isAllowSubReservations}
                    onChange={(e) =>
                        setParking({ ...parking, isAllowSubReservations: e.target.checked })
                    }
                />
                אפשר השכרות משנה (Sub-Reservations)
            </label>

            {imageFile && (
                <img
                    src={URL.createObjectURL(imageFile)}
                    alt="תצוגה מקדימה"
                    style={{ width: '200px', marginTop: '10px' }}
                />
            )}

            <h3>זמינות החניה:</h3>
            {availability.map((slot, index) => (
                <div key={index} className="availability-slot">
                    <label>
                        סוג זמינות:
                        <select
                            value={slot.type}
                            onChange={(e) => handleAvailabilityChange(index, 'type', e.target.value)}
                        >
                            <option value="קבוע">קבוע</option>
                            <option value="זמני">זמני</option>
                        </select>
                    </label>

                    {slot.type === 'זמני' && (
                        <>
                            <label>
                                Start Date:
                                <input
                                    type="date"
                                    value={slot.startDate || ''}
                                    onChange={(e) => handleAvailabilityChange(index, 'startDate', e.target.value)}
                                    required
                                />
                            </label>
                            <label>
                                End Date:
                                <input
                                    type="date"
                                    value={slot.endDate || ''}
                                    onChange={(e) => handleAvailabilityChange(index, 'endDate', e.target.value)}
                                    required
                                />
                            </label>
                        </>
                    )}

                    <div className="days-checkboxes">
                        {weekdays.map(day => (
                            <label key={day}>
                                <input
                                    type="checkbox"
                                    checked={slot.days.includes(day)}
                                    onChange={() => toggleDay(index, day)}
                                />
                                {day}
                            </label>
                        ))}
                    </div>

                    <label>
                        Start time:
                        <input
                            type="time"
                            value={slot.startTime}
                            onChange={(e) => handleAvailabilityChange(index, 'startTime', e.target.value)}
                            required
                        />
                    </label>

                    <label>
                        End time:
                        <input
                            type="time"
                            value={slot.endTime}
                            onChange={(e) => handleAvailabilityChange(index, 'endTime', e.target.value)}
                            required
                        />
                    </label>

                    {availability.length > 1 && (
                        <button type="button" onClick={() => removeAvailability(index)}>הסר</button>
                    )}
                </div>
            ))}


            <button type="button" onClick={addAvailability}>+ Add timeslot</button>

            <br /><br />
            <button type="submit">Add parking</button>
        </form>
    );
}

export default AddParkingForm;
