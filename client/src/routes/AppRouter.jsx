import React, { useContext } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext.jsx';
import MainLayout from '../components/MainLayout';


// עמודים כלליים
import Home from '../pages/Home.jsx';
import Login from '../pages/Login.jsx';
import Register from '../pages/Register.jsx';

// Admin
import AdminDashboard from '../pages/AdminPage.jsx';

// Owner
import OwnerDashboard from '../pages/OwnerPage.jsx';
import MyParkings from '../pages/MyParkings.jsx';
import ReservationsList from '../pages/ReservationsList.jsx';
import AddParking from '../pages/AddParking.jsx';
// Renter
import RenterDashboard from '../pages/RenterPage.jsx'

import Reservation from '../pages/Reservation.jsx';
import ParkingPage from '../pages/ParkingPage.jsx';
import MessagesPage from '../pages/MessagesPage.jsx';
import UsersList from '../pages/UsersList.jsx';

// רוטה פרטית - רק למשתמשים מחוברים
const PrivateRoute = ({ children, allowedRoles }) => {

  const { user, loading } = useContext(AuthContext);

  if (loading) return <div>Loading...</div>;

  if (!user) return <Navigate to="/login" />;
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" />;
  }

  return children;
};

function AppRouter() {
  const location = useLocation();
  const state = location.state;
  const { user, loading } = useContext(AuthContext);
  if (loading) return <div>Loading...</div>;
  const backgroundLocation = state?.backgroundLocation;

  return (
    <>
      {/* מציגים את הדף הקודם אם backgroundLocation קיים */}
      <Routes location={state?.backgroundLocation || location}>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route
            path="/admin"
            element={
              <PrivateRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </PrivateRoute>
            }
          >
            <Route path=":role" element={<UsersList/>} />
            <Route path="parking-management" element={<div>עמוד ניהול חניות</div>} />
            <Route path="orders" element={<div>עמוד ניהול הזמנות</div>} />
          </Route>

          <Route
            path="/owner"
            element={
              <PrivateRoute allowedRoles={['owner']}>
                <OwnerDashboard />
              </PrivateRoute>
            }

          >
            <Route path="my-parkings" element={<MyParkings />} />
            <Route path="reservations" element={<ReservationsList />} />
            <Route path="add-parking" element={<AddParking />} />
          </Route>

          <Route
            path="/renter"
            element={
              <PrivateRoute allowedRoles={['renter']}>
                <RenterDashboard />
              </PrivateRoute>
            }
          >
            <Route path="reservations" element={<ReservationsList />} />

          </Route>

          <Route
            path="/reservation"
            element={
              <PrivateRoute allowedRoles={['renter']}>
                <Reservation />
              </PrivateRoute>
            }
          />

          <Route
            path="/messages"
            element={
              <PrivateRoute allowedRoles={['admin', 'owner', 'renter']}>
                <MessagesPage />
              </PrivateRoute>
            }
          />

          <Route
            path="/parking/:parkingId"
            element={
              <ParkingPage />
            }
          />
        </Route>
      </Routes>

      {state?.backgroundLocation && (
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      )}
    </>
  );
}


export default AppRouter;