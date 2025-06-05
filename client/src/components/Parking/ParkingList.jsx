import React, { useState } from 'react';
import ParkingCard from './ParkingCard';
import Modal from '../Ui/Modal'; // נניח שיש קומפוננטת Modal פשוטה

function ParkingList({ parkings, currentUserId }) {
    const [selectedParking, setSelectedParking] = useState(null);

    const handleClick = (parking) => {
        setSelectedParking(parking);
    };

    const handleClose = () => {
        setSelectedParking(null);
    };

    return (
        <div>
            <h3>Available Parkings:</h3>
            <ul>
                {parkings.map((spot, idx) => (
                    <li
                        key={idx}
                        onClick={() => handleClick(spot)}
                        style={{ cursor: 'pointer', marginBottom: '10px' }}
                    >
                        {spot.address} - {spot.description}
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
        </div>
    );
}

export default ParkingList;
