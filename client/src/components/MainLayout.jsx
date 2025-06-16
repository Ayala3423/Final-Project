import React, { useContext } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import RenterMenu from './RenterMenu';
import OwnerMenu from './OwnerMenu';
import AdminMenu from './AdminMenu';
import '../styles/RentBro.css';

function MainLayout() {
  const location = useLocation();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  console.log("user", user);

  const renderSidebar = () => {
    if (user) {
      switch (user.role) {
        case 'renter':
          return <RenterMenu />;
        case 'owner':
          return <OwnerMenu />;
        case 'admin':
          return <AdminMenu />;
        default:
          return null;
      }
    }
    else {
      return;
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