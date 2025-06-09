import React, { useState } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import '../../styles/Dashboard.css';

function OwnerDashboard() {
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
                <h1>My Dashboard</h1>
            </header>

            <div className="admin-body">
                <nav className="sidebar">
                    <button onClick={toggleMenu}>☰ תפריט</button>
                    {menuOpen && (
                        <div className="dropdown-menu">
                            <button onClick={() => handleClick('משכירים', '/owner/my-parking')}>החניות שלי</button>
                            <button onClick={() => handleClick('שוכרים', '/owner/resevetion')}>ההזמנות </button>
                            <button onClick={() => handleClick('חניות', '/owner/add-parking')}>להוספת חניה</button>
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

export default OwnerDashboard;
