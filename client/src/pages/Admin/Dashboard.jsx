import React, { useState } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import '../../styles/Dashboard.css';

function AdminDashboard() {
    const [menuOpen, setMenuOpen] = useState(false);
    const navigate = useNavigate();

    const toggleMenu = () => setMenuOpen(!menuOpen);

    const handleClick = (item, path) => {
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
                    <button onClick={toggleMenu}>☰ תפריט</button>
                    {menuOpen && (
                        <div className="dropdown-menu">
                            <button onClick={() => handleClick('משכירים', '/admin/owner')}>משכירים</button>
                            <button onClick={() => handleClick('שוכרים', '/admin/renter')}>שוכרים</button>
                            <button onClick={() => handleClick('חניות', '/admin/parking-management')}>חניות</button>
                            <button onClick={() => handleClick('הזמנות', '/admin/orders')}>הזמנות</button>
                            <button onClick={() => handleClick('יציאה', '/')}>יציאה</button>   
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
