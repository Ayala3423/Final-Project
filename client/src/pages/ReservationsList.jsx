import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { apiService } from '../services/genericService';
import '../styles/ReservationsList.css';

function ReservationsList() {
    const { user } = useContext(AuthContext);
    const [reservations, setReservations] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!user) return;

        fetchReservations(page);
    }, [user, page]);

    const fetchReservations = (pageNum) => {
        if (loading || !hasMore) return;

        setLoading(true);
        const userOrder = user.role === 'owner' ? 'ownerId' : 'renterId';
        apiService.getByValue(
            'reservations',
            { [userOrder]: user.id, page: pageNum, limit: 10 },
            (data) => {
                if (data.length < 10) setHasMore(false);
                setReservations(prev => [...prev, ...data]);
                console.log("123", data);
                
                setLoading(false);
            },
            (err) => {
                console.error("Error fetching reservations:", err);
                setError('Failed to load reservations');
                setLoading(false);
            }
        );
    };

    const handleLoadMore = () => {
        setPage(prev => prev + 1);
    };

    if (!user) return <p>Please log in to view reservations.</p>;
    if (error) return <p>{error}</p>;

    console.log("Reservations:", reservations);
    
    return (
        <section className="reservations-section">
            <h3 className="reservations-title">Your Reservations</h3>
            {reservations.length === 0 && !loading && <p>No reservations found.</p>}
            <ul className="reservations-list">
                {reservations.map((res, idx) => (
                    <li key={idx} className="reservation-item">
                        <div><strong>Parking Address:</strong> {res.parkingAddress}</div>
                        <div><strong>Start Time:</strong>{res.startTime}</div>
                        <div><strong>End Time:</strong>{res.endTime}</div>
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

            {hasMore && (
                <div className="load-more-container">
                    <button onClick={handleLoadMore} disabled={loading} className="load-more-button">
                        {loading ? "Loading..." : "Load More"}
                    </button>
                </div>
            )}
        </section>
    );
}

export default ReservationsList;