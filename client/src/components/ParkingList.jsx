import React, { useContext, useEffect, useState } from 'react';
import '../styles/ParkingList.css';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../services/genericService';

function ParkingList({ parkings = [], onHover = () => { } }) {
    console.log("Parkings received in ParkingList:", parkings);

    const [localParkings, setLocalParkings] = useState(parkings);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
const getFullImageUrl = (relativePath) => {
    if (!relativePath) return '/default-parking.jpg';
    return `http://localhost:3000/${relativePath.replace(/^\/+/, '')}`;
};

    useEffect(() => {
        if (Array.isArray(parkings) && parkings.length > 0) {
            setLocalParkings(parkings);
            setHasMore(false); // לא נטען מהשרת אם יש חניות ב-props
        } else {
            setHasMore(true); // כן נטען מהשרת אם אין חניות ב-props
            setPage(1); // נתחיל טעינה מדף ראשון
            setLocalParkings([]); // איפוס לרשימה מקומית
        }
    }, [parkings]);

    useEffect(() => {
        if (hasMore && parkings.length === 0) {
            fetchParkings(page);
        }
    }, [page, hasMore]);

    const fetchParkings = (page) => {
        if (loading || !hasMore) return;

        setLoading(true);
        apiService.getByValue('parking', { page, limit: 10 }, (response) => {
            if (response.length < 10) setHasMore(false);
            setLocalParkings(prev => [...prev, ...response]);
            setLoading(false);
        }, (error) => {
            console.error("Error:", error);
            setLoading(false);
        });
    };

    const handleLoadMore = () => {
        setPage(prev => prev + 1);
    };

    const handleClick = (parking) => {
        navigate(`/parking/${parking.id}`, { state: { parking } });
    };

    const handleOrder = (parking) => {
        if (!user) {
            alert('Please log in to order a parking spot.');
            return;
        }
        apiService.getByValue('timeSlot', { parkingId: parking.id }, (response) => {
            navigate('/reservation', {
                state: { parking: parking, timeSlots: response }
            });
        }, (error) => {
            console.error("Error fetching parking details:", error);
        });
    };

    return (
        <section className="parking-section">
            <h3 className="parking-list-title">Available Parkings:</h3>
            <ul className="parking-list">
                {Array.isArray(localParkings) && localParkings.map((spot, idx) => (
                    <li
                        key={idx}
                        className="parking-item"
                        tabIndex={0}
                        onMouseEnter={() => onHover(spot.id)}
                        onMouseLeave={() => onHover(null)}
                        onKeyDown={(e) => { if (e.key === 'Enter') handleClick(spot); }}
                    >

                        <img
                            src={getFullImageUrl(spot.imageUrl)}
                            alt={`Parking at ${spot.address}`}
                            className="parking-image"
                        />

                        <div className="parking-info" onClick={() => handleClick(spot)}>
                            <div className="parking-address">{spot.address}</div>
                            <div className="parking-description">{spot.description}</div>
                            {spot.price && <div className="parking-price">Price: ₪{spot.price}</div>}
                            {spot.availableSpots !== undefined && (
                                <div className="parking-spots">Available spots: {spot.availableSpots}</div>
                            )}
                        </div>
                        {user?.role === 'renter' && (
                            <button onClick={() => handleOrder(spot)}>order me</button>
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

export default ParkingList;
