import React, { useContext, useEffect, useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import RenterMenu from './RenterMenu';
import OwnerMenu from './OwnerMenu';
import AdminMenu from './AdminMenu';
import '../styles/RentBro.css';
import { apiService } from '../services/genericService';

function MainLayout() {
  const [unreadCount, setUnreadCount] = useState(0);
  const location = useLocation();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  console.log("user", user);

  useEffect(() => {
    if (user) {
      apiService.getByValue("messages", { isRead: false }, (res) => {
        console.log("messages", res);
        setUnreadCount(res.length);

      }, (error) => {
        console.log("error", error);
      })
    }
  }, [user]);


 const renderSidebar = () => {
  if (user) {
    switch (user.role) {
      case 'renter':
        return <RenterMenu unreadCount={unreadCount} />;
      case 'owner':
        return <OwnerMenu unreadCount={unreadCount} />;
      case 'admin':
        return <AdminMenu unreadCount={unreadCount} />;
      default:
        return null;
    }
  } else {
    return null;
  }
};

  return (
    <div className="header">
      <div className='mainLayout'>
        <button className="logo" onClick={() => navigate('/')}>
          <span className="logo-text">ParkIt</span>
          <span className="location-text">Delhi</span>
        </button>
        <div className="username-container">
          <h2 className="username">Hello {user?.name}</h2>
        </div>        {!user && <div className="header-right">
          <button className="list-property-btn" onClick={() => navigate('/login', { state: { backgroundLocation: location } })}>Login</button>
          <button className="list-property-btn" onClick={() => navigate('/register', { state: { backgroundLocation: location } })}>Register</button>
        </div>}
        {renderSidebar()}
      </div>
      <div className="content">
        <Outlet />
      </div>
    </div>
  );
}

export default MainLayout;