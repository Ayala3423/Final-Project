import React, { useState, useContext } from 'react';
import ParkingCard from './ParkingCard';
import Modal from '../Ui/Modal';
import '../../styles/ParkingList.css';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function ParkingList({ parkings, currentUserId }) {
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const [selectedParking, setSelectedParking] = useState(null);

    const handleClick = (parking) => {
        setSelectedParking(parking);
    };

    const handleClose = () => {
        setSelectedParking(null);
    };

    const handleOrder = (parkingId) => {
        if (!user) {
            navigate('/login');
            handleClose();
            alert('Please log in to order a parking spot.');
            return;
        }
        else {
            // Here you would typically handle the order logic, such as navigating to an order page or showing a confirmation
            console.log(`Ordering parking spot with ID: ${parkingId}`);
            // For now, just close the modal if it's open
            handleClose();
        }
    }

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


            {selectedParking && (
                <Modal onClose={handleClose}>
                    <ParkingCard
                        parking={selectedParking}
                        currentUserId={currentUserId}
                        onClose={handleClose}
                    />
                </Modal>
            )}
        </section>
    );
}

export default ParkingList;