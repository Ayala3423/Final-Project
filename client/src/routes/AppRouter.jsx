import React, { useContext } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext.jsx';

// עמודים כלליים
import Home from '../pages/Home';
import Login from '../pages/LoginModal.jsx';
import Register from '../pages/RegisterModal.jsx';

// Admin
import AdminDashboard from '../pages/Admin/Dashboard';
import ParkingManagement from '../pages/Admin/ParkingManagement';
import UsersManagement from '../pages/Admin/UsersManagement';

// Owner
import OwnerDashboard from '../pages/Owner/Dashboard';
import AddParking from '../pages/Owner/AddParking';
import MyParkings from '../pages/Owner/MyParkings';

// Renter
import RenterDashboard from '../pages/Renter/Dashboard';
import MyReservations from '../pages/Renter/MyReservations';
import Payment from '../pages/Renter/Payment';
import UserParkings from '../components/User/UserParkings.jsx';
import RentBro from '../pages/RentBro.jsx';

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

  const backgroundLocation = state?.backgroundLocation;

  return (
    <>
      {/* מציגים את הדף הקודם אם backgroundLocation קיים */}
    <Routes location={state?.backgroundLocation || location}>
        <Route path="/" element={<Home />} />
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
          <Route path=":userType" element={<UsersManagement />} />
          <Route path="parking-management" element={<ParkingManagement />} />
        </Route>

        <Route
          path="/owner"
          element={
            <PrivateRoute allowedRoles={['owner']}>
              <OwnerDashboard />
            </PrivateRoute>
          }
        >
          <Route path="add-parking" element={<AddParking />} />
          <Route path="resevetion" element={<MyReservations />} />
          <Route path="my-parking" element={<MyParkings />} />
        </Route>

        <Route
          path="/renter"
          element={
            <PrivateRoute allowedRoles={['renter']}>
              <RenterDashboard />
            </PrivateRoute>
          }
        >
          <Route path=":userType" element={<UsersManagement />} />
          <Route path="my-reservations" element={<MyReservations />} />
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


// import React, { useContext } from 'react';
// import { Routes, Route, Navigate } from 'react-router-dom';
// import { AuthContext } from '../context/AuthContext.jsx';

// // עמודים כלליים
// import Home from '../pages/Home';
// import Login from '../pages/Login';
// import Register from '../pages/Register';

// // רוטה פרטית - רק למשתמשים מחוברים
// const PrivateRoute = ({ children, allowedRoles }) => {
//   const { user, loading } = useContext(AuthContext);

//   if (loading) return <div>Loading...</div>;

//   if (!user) return <Navigate to="/login" />;
//   if (allowedRoles && !allowedRoles.includes(user.role)) {
//     return <Navigate to="/" />;
//   }

//   return children;
// };

// function AppRouter() {
//   return (
//     <Routes>
//       {/* רוטות פתוחות */}
//       <Route path="/" element={<Home />} />
//       <Route path="/user/login" element={<Login />} />
//       <Route path="/register" element={<Register />} />

//       {/* רוטות Admin */}
// //       <Route
// //         path="/admin/dashboard"
// //         element={
// //           <PrivateRoute allowedRoles={['admin']}>
// //             <AdminDashboard />
// //           </PrivateRoute>
// //         }
// //       />
// //       <Route
// //         path="/admin/parking-management"
// //         element={
// //           <PrivateRoute allowedRoles={['admin']}>
// //             <ParkingManagement />
// //           </PrivateRoute>
// //         }
// //       />
// //       <Route
// //         path="/admin/users-management"
// //         element={
// //           <PrivateRoute allowedRoles={['admin']}>
// //             <UsersManagement />
// //           </PrivateRoute>
// //         }
// //       />
//     </Routes>
//   );
// }

// export default AppRouter;
