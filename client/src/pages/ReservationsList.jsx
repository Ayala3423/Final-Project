import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { apiService } from '../services/genericService';
import '../styles/ReservationsList.css';

function ReservationsList() {
    const { user } = useContext(AuthContext);
    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!user) return;

        const userOrder = user.role === 'owner' ? 'ownerId' : 'renterId';
        console.log("Fetching reservations for user:", user.id, "with order:", userOrder);
        
        apiService.getByValue('reservation', { [userOrder]: user.id },
            (data) => {
                setReservations(data);
                setLoading(false);
            },
            (err) => {
                console.error("Error fetching reservations:", err);
                setError('Failed to load reservations');
                setLoading(false);
            }
        );
    }, [user]);

    if (!user) return <p>Please log in to view reservations.</p>;
    if (loading) return <p>Loading reservations...</p>;
    if (error) return <p>{error}</p>;

    return (
        <section className="reservations-section">
            <h3 className="reservations-title">Your Reservations</h3>
            {reservations.length === 0 ? (
                <p>No reservations found.</p>
            ) : (
                <ul className="reservations-list">
                    {reservations.map((res, idx) => (
                        <li key={idx} className="reservation-item">
                            <div><strong>Parking Address:</strong> {res.parkingAddress}</div>
                            <div><strong>Start Time:</strong> {new Date(res.startTime).toLocaleString()}</div>
                            <div><strong>End Time:</strong> {new Date(res.endTime).toLocaleString()}</div>
                            {user.role === 'owner' && (
                                <div><strong>Renter:</strong> {res.renterName}</div>
                            )}
                            {user.role === 'renter' && (
                                <div><strong>Owner:</strong> {res.ownerName}</div>
                            )}
                            <div><strong>Status:</strong> {res.status}</div>
                        </li>
                    ))}
                </ul>
            )}
        </section>
    );
}

export default ReservationsList;