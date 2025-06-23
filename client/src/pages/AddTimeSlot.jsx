import React from 'react';

const weekdays = ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת'];

export default function AddTimeSlot({ availability, setAvailability }) {
    
    if (!Array.isArray(availability)) {
        console.error('Availability is not an array', availability);
        return <div>שגיאה בטעינת זמינות</div>;
    }

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
            { type: 'fixed', days: [], startTime: '', endTime: '', price: '' }
        ]);
    };

    const removeAvailability = (index) => {
        const updated = [...availability];
        updated.splice(index, 1);
        setAvailability(updated);
    };

    return (
        <div>
            <h3>זמינות החניה:</h3>
            {availability?.map((slot, index) => (
                <div key={index} className="availability-slot">
                    <label>
                        סוג זמינות:
                        <select
                            value={slot.type}
                            onChange={(e) => handleAvailabilityChange(index, 'type', e.target.value)}
                        >
                            <option value="fixed">קבוע</option>
                            <option value="temporary">זמני</option>
                        </select>
                    </label>

                    {slot.type === 'temporary' && (
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

                    <label>
                        מחיר (בש"ח):
                        <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={slot.price}
                            onChange={(e) => handleAvailabilityChange(index, 'price', e.target.value)}
                            required
                        />
                    </label>

                    {availability.length > 1 && (
                        <button type="button" onClick={() => removeAvailability(index)}>הסר</button>
                    )}
                </div>
            ))}

            <button type="button" onClick={addAvailability}>+ Add timeslot</button>
        </div>
    );
}