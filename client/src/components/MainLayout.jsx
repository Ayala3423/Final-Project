import React, { useContext } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import RenterMenu from './RenterMenu';
import OwnerMenu from './OwnerMenu';
import AdminMenu from './AdminMenu';

function MainLayout() {

  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
    
  const renderSidebar = () => {
    console.log('User in MainLayout:', user);
    
    
    if (!(user)) {
      return (
        <div className="sidebar">
          <button onClick={() => navigate('/login')}>Login</button>
          <button onClick={() => navigate('/register')}>Register</button>
        </div>
      );
    }

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
  };

  return (
    <div className="layout">
      {renderSidebar()}
      <div className="content">
        <Outlet />
      </div>
    </div>
  );
}

export default MainLayout;
