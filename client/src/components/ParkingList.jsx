import React, { useContext } from 'react';
import '../styles/ParkingList.css';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../services/genericService';

function ParkingList({ parkings, setParkings = () => { }, onHover = () => { } }) {
    
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);

    const getFullImageUrl = (relativePath) => {
        if (!relativePath) return '/default-parking.jpg';
        console.log("relativePath", relativePath);
        
        return `http://localhost:3000/uploads/parkings/${relativePath.replace(/^\/+/, '')}`;
    };

    const handleClick = (parking) => {
        navigate(`/parking/${parking.id}`, { state: { parking } });
    };

    const handleOrder = (parking) => {
        if (!user) {
            alert('Please log in to order a parking spot.');
            return;
        }
        apiService.getByValue('timeSlots', { parkingId: parking.id }, (response) => {
            console.log("Time slots for parking:", response);

            navigate('/reservation', {
                state: { parking, timeSlots: response }
            });
        }, (error) => {
            console.error("Failed to fetch time slots:", error);
            alert("Failed to fetch time slots for this parking.");
        });
    };

    const handleDelete = (parkingId) => {
        if (!window.confirm("Are you sure you want to delete this parking spot?")) return;
        apiService.remove('parkings', parkingId, () => {
            setParkings(prev => prev.filter(p => p.id !== parkingId));
        }, (error) => {
            console.error("Failed to delete parking:", error);
            alert("Failed to delete parking.");
        });
    };

    return (
        <section className="parking-section">
            <h3 className="parking-list-title">Parkings:</h3>
            <ul className="parking-list">
                {Array.isArray(parkings) && parkings.map((spot, idx) => (
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
                            <button onClick={() => handleOrder(spot)}>Order Me</button>
                        )}


                        {user?.role === 'admin' && (
                            <button onClick={() => handleDelete(spot.id)} className="delete-button">
                                Delete
                            </button>
                        )}

                    </li>
                ))}
            </ul>
        </section>
    );
}

export default ParkingList;