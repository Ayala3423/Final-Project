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
    const [cancelError, setCancelError] = useState(null);
    const [cancelSuccess, setCancelSuccess] = useState(null);

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
                setLoading(false);
            },
            (err) => {
                console.error("Error fetching reservations:", err);
                setError('Failed to load reservations.');
                setLoading(false);
            }
        );
    };

    const handleLoadMore = () => {
        setPage(prev => prev + 1);
    };

    const canCancel = (startTimeStr) => {
        const startTime = new Date(startTimeStr);
        const now = new Date();
        const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000);
        return startTime > oneHourLater;
    };

    const handleCancel = (reservationId) => {
        setCancelError(null);
        setCancelSuccess(null);

        const reservation = reservations.find(r => r.id === reservationId);
        if (!canCancel(reservation.startTime)) {
            setCancelError("You can only cancel a reservation more than one hour before it starts.");
            return;
        }

        apiService.remove(
            'reservations',
            reservationId,
            () => {
                setReservations(prev => prev.filter(r => r.id !== reservationId));
                setCancelSuccess("Reservation canceled successfully.");
            },
            (err) => {
                console.error("Cancel error:", err);
                setCancelError("Failed to cancel reservation.");
            }
        );
    };

    if (!user) return <p>Please log in to view reservations.</p>;
    if (error) return <p>{error}</p>;

    return (
        <section className="reservations-section">
            <h3 className="reservations-title">Your Reservations</h3>

            {cancelError && <p className="error-message">{cancelError}</p>}
            {cancelSuccess && <p className="success-message">{cancelSuccess}</p>}

            {reservations.length === 0 && !loading && <p>No reservations found.</p>}

            <ul className="reservations-list">
                {reservations.map((res, idx) => (
                    <li key={idx} className="reservation-item">
                        <div><strong>Start Time:</strong> {res.startTime}</div>
                        <div><strong>End Time:</strong> {res.endTime}</div>
                        {user.role === 'owner' && (
                            <div><strong>Renter:</strong> {res.renterName}</div>
                        )}
                        {user.role === 'renter' && (
                            <div><strong>Owner:</strong> {res.ownerId}</div>
                        )}
                        
                        {user.role === 'renter' && canCancel(res.startTime) && (
                            <button onClick={() => handleCancel(res.id)} className="cancel-button">
                                Cancel Reservation
                            </button>
                        )}
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