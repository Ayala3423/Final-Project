import React, { useState } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import { HiMenuAlt3 } from 'react-icons/hi';
import '../styles/Dashboard.css';

function AdminDashboard() {
    const [menuOpen, setMenuOpen] = useState(false);
    const navigate = useNavigate();

    const toggleMenu = () => setMenuOpen(!menuOpen);

    const handleClick = (path) => {
        setMenuOpen(false);
        navigate(path);
    };

    return (
        <div className="admin-layout">
            <header className="admin-header">
                <h1>Admin Dashboard</h1>
            </header>

            <div className="admin-body">
                <nav className="sidebar">
                    <button className="menu-toggle" onClick={toggleMenu}>
                        <HiMenuAlt3 size={24} />
                    </button>

                    {menuOpen && (
                        <div className="dropdown-menu">
                            <button onClick={() => handleClick('/admin/owner')}>owners</button>
                            <button onClick={() => handleClick('/admin/renter')}>renters</button>
                            <button onClick={() => handleClick('/admin/parking-management')}>parkings</button>
                            <button onClick={() => handleClick('/admin/orders')}>orders</button>
                            <button onClick={() => handleClick('/messages')}>Messages</button>
                            <button onClick={() => handleClick('/')}>logout</button>   
                        </div>
                    )}
                </nav>

                <main className="admin-content">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}

export default AdminDashboard;