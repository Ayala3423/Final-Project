
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Home from '../Home';
import { useState, useEffect } from 'react';

function UsersManagement() {


    const navigate = useNavigate();
    const [users, setUsers] = useState([]);

    useEffect(() => {
        // Fetch users from the API
        fetch('/api/users')
            .then(response => response.json())
            .then(data => setUsers(data))
            .catch(error => console.error('Error fetching users:', error));
    }, []);

    const handleOwnerDashboard = () => {
        navigate('/owner/dashboard');
    };

    const handleRenterDashboard = () => {
        navigate('/renter/dashboard');
    };

    return (
        <div>
            <h1>Users Management</h1>
            <button onClick={handleOwnerDashboard}>Go to Owner Dashboard</button>
            <button onClick={handleRenterDashboard}>Go to Renter Dashboard</button>
            <Home />
            <ul>
                {users.map(user => (
                    <li key={user.id}>{user.name} - {user.email}</li>
                ))}
            </ul>
        </div>
    );
}

export default UsersManagement;