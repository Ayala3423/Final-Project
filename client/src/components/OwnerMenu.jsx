import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, Outlet, useLocation } from 'react-router-dom';
import '../styles/Dashboard.css';
import { AuthContext } from '../context/AuthContext';

function OwnerMenu({ unreadCount, setUnreadCount }) {
    
    const location = useLocation();
    const [menuOpen, setMenuOpen] = useState(false);
    const navigate = useNavigate();
    const { logout } = useContext(AuthContext);
    const toggleMenu = () => setMenuOpen(!menuOpen);

    const handleClick = (path) => {
        setMenuOpen(false);
        navigate(path);
    };

    useEffect(() => {
        if (location.pathname.startsWith('/messages')) {
            setUnreadCount(0); 
        }
    }, [location.pathname]);

    return (
        <>
            <nav className="sidebar">
                <button onClick={toggleMenu}>☰ menu</button>
                {menuOpen && (
                    <div className="dropdown-menu">
                        <button onClick={() => handleClick('/owner')}>home</button>
                        <button onClick={() => handleClick('/owner/my-profile')}>My profile</button>
                        <button onClick={() => handleClick('/owner/my-parkings')}>My parkings</button>
                        <button onClick={() => handleClick('/owner/reservations')}>Reservations</button>
                        <button onClick={() => handleClick('/owner/add-parking')}>Add parking</button>
                        <button onClick={() => handleClick('/messages')}>
                            Messages
                            {unreadCount > 0 && (
                                <span className="notification-badge">{unreadCount}</span>
                            )}
                        </button>
                        <button onClick={() => logout()}>Logout</button>
                    </div>
                )}
            </nav>

            {menuOpen && <div className="menu-overlay" onClick={toggleMenu}></div>}
        </>
    );
}

export default OwnerMenu;