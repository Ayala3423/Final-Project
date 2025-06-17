import React, { useState, useContext } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import '../styles/Dashboard.css';
import { AuthContext } from '../context/AuthContext';

function RenterMenu() {    
    const [menuOpen, setMenuOpen] = useState(false);
    const navigate = useNavigate();
    const { logout } = useContext(AuthContext);
    const toggleMenu = () => setMenuOpen(!menuOpen);

    const handleClick = (path) => {
        setMenuOpen(false);
        navigate(path);
    };

    return (
            <nav className="sidebar">
                <button onClick={toggleMenu}>☰ </button>
                {menuOpen && (
                    <div className="dropdown-menu">
                        <button onClick={() => handleClick('/')}>🏠</button>
                        <button onClick={() => handleClick('/renter/my-profile')}>My profile</button>
                        <button onClick={() => handleClick('/renter/reservations')}>Reservations</button>
                        <button onClick={() => handleClick('/messages')}>Messages</button>
                        <button onClick={() => logout()}>Logout</button>
                    </div>
                )}
            </nav> 
    );
}

export default RenterMenu;