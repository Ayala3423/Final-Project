import React from 'react';

function ParkingList({ parkings }) {
    return (
        <div>
            <h3>Available Parkings:</h3>
            <ul>
                {parkings.map((spot, idx) => (
                    <li key={idx}>{spot.address} - {spot.description}</li>
                ))}
            </ul>
        </div>
    );
}

export default ParkingList;
