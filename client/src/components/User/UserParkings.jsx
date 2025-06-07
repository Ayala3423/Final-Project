import React from 'react';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../../services/genericService';
import { useState, useEffect } from 'react';
import ParkingList from '../../components/Parking/ParkingList';

function UserParkings({ownerId}) {
    const navigate = useNavigate();
    const [parkings, setParkings] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        console.log("Parking Management Component Mounted" + ownerId);
        apiService.getByValue('parking', { "ownerId": ownerId }, (response) => {
            console.log("Fetched Parkings:", response);
            setParkings(response);
        }, (error) => {
            console.error("Error fetching parkings:", error.message);
        });
    }, [ownerId]);

    return (
        <div>
            <h1>My Parkings</h1>
            <ParkingList parkings={parkings} />
        </div>
    );
}

export default UserParkings;