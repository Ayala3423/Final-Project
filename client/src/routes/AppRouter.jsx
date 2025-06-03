// import React, { useContext } from 'react';
// import { Routes, Route, Navigate } from 'react-router-dom';
// import { AuthContext } from '../context/AuthProvider.jsx';

// // עמודים כלליים
// import Home from '../pages/Home';
// import Login from '../pages/Login';
// import Register from '../pages/Register';
// import Search from '../pages/Search';

// // Admin
// import AdminDashboard from '../pages/Admin/Dashboard';
// import ParkingManagement from '../pages/Admin/ParkingManagement';
// import UsersManagement from '../pages/Admin/UsersManagement';

// // Owner
// import OwnerDashboard from '../pages/Owner/Dashboard';
// import AddParking from '../pages/Owner/AddParking';
// import MyParkings from '../pages/Owner/MyParkings';

// // Renter
// import RenterDashboard from '../pages/Renter/Dashboard';
// import MyReservations from '../pages/Renter/MyReservations';
// import Payment from '../pages/Renter/Payment';

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
//       <Route path="/login" element={<Login />} />
//       <Route path="/register" element={<Register />} />
//       <Route path="/search" element={<Search />} />

//       {/* רוטות Admin */}
//       <Route
//         path="/admin/dashboard"
//         element={
//           <PrivateRoute allowedRoles={['admin']}>
//             <AdminDashboard />
//           </PrivateRoute>
//         }
//       />
//       <Route
//         path="/admin/parking-management"
//         element={
//           <PrivateRoute allowedRoles={['admin']}>
//             <ParkingManagement />
//           </PrivateRoute>
//         }
//       />
//       <Route
//         path="/admin/users-management"
//         element={
//           <PrivateRoute allowedRoles={['admin']}>
//             <UsersManagement />
//           </PrivateRoute>
//         }
//       />

//       {/* רוטות Owner */}
//       <Route
//         path="/owner/dashboard"
//         element={
//           <PrivateRoute allowedRoles={['owner']}>
//             <OwnerDashboard />
//           </PrivateRoute>
//         }
//       />
//       <Route
//         path="/owner/add-parking"
//         element={
//           <PrivateRoute allowedRoles={['owner']}>
//             <AddParking />
//           </PrivateRoute>
//         }
//       />
//       <Route
//         path="/owner/my-parkings"
//         element={
//           <PrivateRoute allowedRoles={['owner']}>
//             <MyParkings />
//           </PrivateRoute>
//         }
//       />

//       {/* רוטות Renter */}
//       <Route
//         path="/renter/dashboard"
//         element={
//           <PrivateRoute allowedRoles={['renter']}>
//             <RenterDashboard />
//           </PrivateRoute>
//         }
//       />
//       <Route
//         path="/renter/my-reservations"
//         element={
//           <PrivateRoute allowedRoles={['renter']}>
//             <MyReservations />
//           </PrivateRoute>
//         }
//       />
//       <Route
//         path="/renter/payment"
//         element={
//           <PrivateRoute allowedRoles={['renter']}>
//             <Payment />
//           </PrivateRoute>
//         }
//       />
//     </Routes>
//   );
// }

// export default AppRouter;


import React, { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext.jsx';

// עמודים כלליים
import Home from '../pages/Home';
import Login from '../pages/Login';
import Register from '../pages/Register';

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
  return (
    <Routes>
      {/* רוטות פתוחות */}
      <Route path="/" element={<Home />} />
      <Route path="/user/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      
    </Routes>
  );
}

export default AppRouter;
