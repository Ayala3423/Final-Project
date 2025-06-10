import React, {useState,useContext} from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import '../styles/Dashboard.css';
import { AuthContext } from '../context/AuthContext';


function OwnerMenu() {
     const [menuOpen, setMenuOpen] = useState(false);
    const navigate = useNavigate();
    const { logout } = useContext(AuthContext);

    const toggleMenu = () => setMenuOpen(!menuOpen);

    const handleClick = (item, path) => {
        setMenuOpen(false);
        navigate(path);
    };

  return (
    <div className="admin-body">
                <nav className="sidebar">
                    <button onClick={toggleMenu}>☰ תפריט</button>
                    {menuOpen && (
                        <div className="dropdown-menu">
                            <button onClick={() => handleClick('דף הבית', '/')}>🏠 דף הבית</button>
                            <button onClick={() => handleClick('משכירים', '/owner/my-parking')}>החניות שלי</button>
                            <button onClick={() => handleClick('שוכרים', '/owner/resevetion')}>ההזמנות </button>
                            <button onClick={() => handleClick('חניות', '/owner/add-parking')}>להוספת חניה</button>
                            <button onClick={() => handleClick('חניות', '/messages')}>Messages</button>
                            <button onClick={() => logout()}>יציאה</button>   
                        </div>
                    )}
                </nav>

            </div>
  );
}

export default OwnerMenu;
