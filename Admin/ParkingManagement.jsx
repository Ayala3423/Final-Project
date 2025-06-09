
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../../services/genericService';
import ParkingList from '../../components/Parking/ParkingList';

function ParkingManagement() {

    const navigate = useNavigate();
    const [parkings, setParkings] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        // You can add any initialization logic here if needed
        console.log("Parking Management Component Mounted");
        apiService.getAll('parking', (response) => {
            console.log("Fetched Parkings:", response);
            setParkings(response);
        }, (error) => {
            console.error("Error fetching parkings:", error.message);
        }); 
    }, []);

    return (
        <div>
            <h1>Parking Management</h1>
            <ParkingList parkings={parkings} />
        </div>
    );
}   

export default ParkingManagement;