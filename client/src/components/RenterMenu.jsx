import React, { useState, useContext } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import '../styles/Dashboard.css';
import { AuthContext } from '../context/AuthContext';


function RenterMenu() {
    console.log('RenterMenu component rendered');
    
    const [menuOpen, setMenuOpen] = useState(false);
    const navigate = useNavigate();
    const { logout } = useContext(AuthContext);
    const toggleMenu = () => setMenuOpen(!menuOpen);

    const handleClick = (path) => {
        setMenuOpen(false);
        navigate(path);
    };


    return (
        <div className="admin-body">
            <nav className="sidebar">
                <button onClick={toggleMenu}>☰ תפריט</button>
                {menuOpen && (
                    <div className="dropdown-menu">
                        <button onClick={() => handleClick('/')}>🏠</button>
                        <button onClick={() => handleClick('/renter/my-reservations')}>הזמנות שלי</button>
                        <button onClick={() => handleClick('/renter/add-reservation')}>יצירת הזמנה</button>
                        <button onClick={() => handleClick('/messages')}>Messages</button>
                        <button onClick={() => logout()}>יציאה</button>
                    </div>
                )}
            </nav>

            
        </div>
    );
}

export default RenterMenu;
