

import React from 'react';
import { useNavigate } from 'react-router-dom';
import Home from '../Home';

function Dashboard() {
    const navigate = useNavigate();

    const handleOwnerDashboard = () => {
        navigate('/owner/dashboard');
    };

    const handleRenterDashboard = () => {
        navigate('/renter/dashboard');
    };

    return (
        <div>
            <h1>Owner Dashboard</h1>
            <Home/>
        </div>
    );
}

export default Dashboard;