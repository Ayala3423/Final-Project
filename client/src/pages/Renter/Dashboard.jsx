

import React, {useState} from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import Home from '../Home';


function Dashboard() {

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
                <h1>Renter Dashboard</h1>
            </header>

            <div className="admin-body">
                <nav className="sidebar">
                    <button onClick={toggleMenu}>☰ תפריט</button>
                    {menuOpen && (
                        <div className="dropdown-menu">
                            <button onClick={() => handleClick('הזמנות שלי', '/renter/my-reservations')}>הזמנות שלי</button>
                            <button onClick={() => handleClick('יצירת הזמנה', '/renter/renter')}>יצירת הזמנה</button>
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

export default Dashboard;