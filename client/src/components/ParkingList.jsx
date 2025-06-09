import React, { useState, useContext } from 'react';
import Modal from './Modal';
import '../styles/ParkingList.css';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function ParkingList({ parkings }) {
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);

    const handleClick = (parking) => {
        
        navigate(`/parking/${parking.id}`, { state: { parking } }); 
    };

    return (
        <section className="parking-section">
            <h3 className="parking-list-title">Available Parkings:</h3>
            <ul className="parking-list">
                {parkings.map((spot, idx) => (
                    <li
                        key={idx}
                        onClick={() => handleClick(spot)}
                        className="parking-item"
                        tabIndex={0}
                        onKeyDown={(e) => { if (e.key === 'Enter') handleClick(spot); }}
                    >
                        <img
                            src={spot.imageUrl || '/default-parking.jpg'}
                            alt={`Parking at ${spot.address}`}
                            className="parking-image"
                        />
                        <div className="parking-info">
                            <div className="parking-address">{spot.address}</div>
                            <div className="parking-description">{spot.description}</div>
                            {spot.price && <div className="parking-price">Price: ₪{spot.price}</div>}
                            {spot.availableSpots !== undefined && (
                                <div className="parking-spots">Available spots: {spot.availableSpots}</div>
                            )}
                        </div>
                    </li>
                ))}
            </ul>

        </section>
    );
}

export default ParkingList;