

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { apiService } from '../../services/genericService';

import '../../styles/addReservation.css'; // Assuming you have a CSS file for styling


const AddReservation = () => {
    const navigate = useNavigate();
    const [parkingSpaces, setParkingSpaces] = useState([]);
    const [selectedParking, setSelectedParking] = useState('');
    const [startTime, setStartTime] = useState('');
    const [duration, setDuration] = useState(1);
    const [error, setError] = useState('');

    useEffect(() => {
        apiService.getAll('parking', (response) => {
            setParkingSpaces(response);
        }, (error) => {
            console.error("Error fetching parking spaces:", error.message);
        });
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!selectedParking || !startTime || !duration) {
            setError('Please fill in all fields');
            return;
        }

        const reservationData = {
            parkingId: selectedParking,
            startTime,
            duration
        };

        apiService.create('reservation', reservationData, (response) => {
            console.log("Reservation created:", response);
            navigate('/renter/my-reservations');
        }, (error) => {
            console.error("Error creating reservation:", error.message);
            setError('Failed to create reservation');
        });
    };

    return (
        <div className="add-reservation">
            <h1>Add Reservation</h1>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="parking">Select Parking Space:</label>
                    <select
                        id="parking"
                        value={selectedParking}
                        onChange={(e) => setSelectedParking(e.target.value)}
                    >
                        <option value="">Select a parking space</option>
                        {parkingSpaces.map((space) => (
                            <option key={space.id} value={space.id}>
                                {space.name} - {space.location}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="startTime">Start Time:</label>
                    <input
                        type="datetime-local"
                        id="startTime"
                        value={startTime}
                        onChange={(e) => setStartTime(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="duration">Duration (hours):</label>
                    <input
                        type="number"
                        id="duration"
                        value={duration}    
                        onChange={(e) => setDuration(Number(e.target.value))}
                        min="1"
                        max="24"
                    />
                </div>
                {error && <p className="error">{error}</p>}
                <button type="submit" className="submit-btn">Create Reservation</button>
            </form>
            <button className="cancel-btn" onClick={() => navigate('/renter/my-reservations')}>
                Cancel
            </button>
        </div>
    );
}
export default AddReservation;