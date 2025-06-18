import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { HiMenuAlt3 } from 'react-icons/hi';
import { AuthContext } from '../context/AuthContext';

function AdminMenu({ unreadCount }) {
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
            <button className="menu-toggle" onClick={toggleMenu}>
                <HiMenuAlt3 size={24} />
            </button>

            {menuOpen && (
                <div className="dropdown-menu">
                    <button onClick={() => handleClick('/')}>🏠 Home</button>
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