import React from 'react';
import { useNavigate } from 'react-router-dom';
import Search from './Search'; // Assuming Search component is in the same directory

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
            <Search onSearch={(filters) => console.log(filters)} />
        </div>
    );
}

export default Home;