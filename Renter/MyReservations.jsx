


import React, { useEffect, useState,useContext } from 'react';
import { useNavigate  } from 'react-router-dom';
import { apiService } from '../../services/genericService';
import {AuthContext} from '../../context/AuthContext';


function MyReservations() {
    const navigate = useNavigate();
    const [reservations, setReservations] = useState([]);
    const { user } = useContext(AuthContext);

    useEffect(() => {
        apiService.getByValue('reservation', { "renterId": user.id }, (response) => {
            console.log("Fetched Reservations:", response);
            setReservations(response);
        }, (error) => {
            console.error("Error fetching reservations:", error.message);
        });
    }, []);

    return (
        <div>
            <h1>My Reservations</h1>
            <ul>
                {reservations.map(reservation => (
                    <li key={reservation.id}>{reservation.details}</li>
                ))}
            </ul>
        </div>
    );
}

export default MyReservations;