

import React from 'react';
import { useNavigate } from 'react-router-dom';

function MyParkings() {
    const navigate = useNavigate();

    const handleOwnerDashboard = () => {
        navigate('/owner/dashboard');
    };

    const handleRenterDashboard = () => {
        navigate('/renter/dashboard');
    };

    return (
        <div>
            <h1>My Parkings</h1>
            <button onClick={handleOwnerDashboard}>Go to Owner Dashboard</button>
            <button onClick={handleRenterDashboard}>Go to Renter Dashboard</button>
        </div>
    );
}

export default MyParkings;