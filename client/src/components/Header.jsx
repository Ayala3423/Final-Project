// components/Header.jsx
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../styles/RentBro.css';

function Header() {
    const navigate = useNavigate();
    const location = useLocation();

    return (
        <header className="header">
            <div className="logo" onClick={() => navigate('/')}>
                <span className="logo-text">ParkIt</span>
                <span className="location-text">Delhi</span>
            </div>
            <div className="header-right">
                <button className="list-property-btn" onClick={() => navigate('/login', { state: { backgroundLocation: location } })}>Login</button>
                <button className="list-property-btn" onClick={() => navigate('/register', { state: { backgroundLocation: location } })}>Register</button>
            </div>
        </header>
    );
}

export default Header;
