import React from 'react';
import { useNavigate } from 'react-router-dom';

function Home() {
    const navigate = useNavigate();

    const handleLogin = () => {
        navigate('/user/login');
    };

    const handleRegister = () => {
        navigate('/register');
    };

    return (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <h1>Welcome to the Parking Management System</h1>
            <p>Manage your parking spaces efficiently.</p>
            <button onClick={handleLogin} style={{ marginRight: '10px' }}>
                Login
            </button>
            <button onClick={handleRegister}>
                Register
            </button>
        </div>
    );
}

export default Home;