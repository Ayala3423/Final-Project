import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { HiMenuAlt3 } from 'react-icons/hi';
import { AuthContext } from '../context/AuthContext';

function AdminMenu({ unreadCount, setUnreadCount }) {

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
        <nav className="sidebar">
            <button onClick={toggleMenu}>☰ menu</button>

            {menuOpen && (
                <div className="dropdown-menu">
                    <button onClick={() => handleClick('/admin')}>🏠 Home</button>
                    <button onClick={() => handleClick('/admin/owner')}>owners</button>
                    <button onClick={() => handleClick('/admin/renter')}>renters</button>
                    <button onClick={() => handleClick('/admin/parking-management')}>parkings</button>
                    <button onClick={() => handleClick('/admin/orders')}>orders</button>
                    <button onClick={() => handleClick('/messages')}>
                        Messages
                        {unreadCount > 0 && (
                            <span className="notification-badge">{unreadCount}</span>
                        )}
                    </button>
                    <button onClick={() => logout()}>יציאה</button>
                </div>
            )}
        </nav>
    );
}

export default AdminMenu;