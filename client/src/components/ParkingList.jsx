import React, { useState, useContext } from 'react';
import Modal from './Modal';
import '../styles/ParkingList.css';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../services/genericService';

function ParkingList({ parkings, onHover = () => {} }) {
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);

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
                            src={spot.imageUrl || '/default-parking.jpg'}
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
                        {user?.role=='renter'&&<button onClick={() => handleOrder(spot)}>order me</button>}
                    </li>
                ))}
            </ul>
        </section>
    );
}


export default ParkingList;