


import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function MyReservations() {
    const navigate = useNavigate();
    const [reservations, setReservations] = useState([]);

    useEffect(() => {
        // Fetch reservations from the server
        fetch('/api/renter/reservations')
            .then(response => response.json())
            .then(data => setReservations(data))
            .catch(error => console.error('Error fetching reservations:', error));
    }, []);

    const handleOwnerDashboard = () => {
        navigate('/owner/dashboard');
    };

    const handleRenterDashboard = () => {
        navigate('/renter/dashboard');
    };

    return (
        <div>
            <h1>My Reservations</h1>
            <button onClick={handleOwnerDashboard}>Go to Owner Dashboard</button>
            <button onClick={handleRenterDashboard}>Go to Renter Dashboard</button>
            <ul>
                {reservations.map(reservation => (
                    <li key={reservation.id}>{reservation.details}</li>
                ))}
            </ul>
        </div>
    );
}

export default MyReservations;