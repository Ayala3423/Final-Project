import React, { useState, useContext } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import '../styles/Dashboard.css';
import { AuthContext } from '../context/AuthContext';


function OwnerMenu() {
    const [menuOpen, setMenuOpen] = useState(false);
    const navigate = useNavigate();
    const { logout } = useContext(AuthContext);
    const { user } = useContext(AuthContext);
    const toggleMenu = () => setMenuOpen(!menuOpen);

    const handleClick = (path) => {
        setMenuOpen(false);
        navigate(path);
    };


    return (
            <nav className="sidebar">
                <button onClick={toggleMenu}>☰ תפריט</button>
                {menuOpen && (
                    <div className="dropdown-menu">
                        <button onClick={() => handleClick('/')}>🏠 דף הבית</button>
                        <button onClick={() => handleClick('/owner/my-profile')}>הפרופיל שלי!</button>
                        <button onClick={() => handleClick('/owner/my-parkings')}>החניות שלי</button>
                        <button onClick={() => handleClick('/owner/reservations')}>ההזמנות </button>
                        <button onClick={() => handleClick('/owner/add-parking')}>להוספת חניה</button>
                        <button onClick={() => handleClick('/messages')}>Messages</button>
                        <button onClick={() => logout()}>יציאה</button>
                    </div>
                )}
            </nav>

    );
}

export default OwnerMenu;
