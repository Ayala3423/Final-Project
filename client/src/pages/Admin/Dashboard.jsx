
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
            <h1>Admin Dashboard</h1>
            <button onClick={handleOwnerDashboard}>Go to Owner Dashboard</button>
            <button onClick={handleRenterDashboard}>Go to Renter Dashboard</button>
            <Home/>
        </div>
    );
}
export default Dashboard;