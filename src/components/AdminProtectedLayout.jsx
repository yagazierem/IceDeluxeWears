// // src/components/admin/AdminProtectedRoute.jsx
// import React from 'react';
// import { Navigate, Outlet } from 'react-router-dom';
// import { useAuth } from '../contexts/AuthContext';
// import AdminLayout from './ AdminLayout';
// const AdminProtectedRoute = () => {
//   const { isAuthenticated, loading } = useAuth();
  
//   // Show loading spinner while auth check is in progress
//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gray-100">
//         <div className="text-center">
//           <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full text-blue-600" role="status">
//             <span className="visually-hidden">Loading...</span>
//           </div>
//           <p className="mt-2 text-gray-600">Verifying authentication...</p>
//         </div>
//       </div>
//     );
//   }
  
//   // Redirect to login if not authenticated
//   if (!isAuthenticated()) {
//     return <Navigate to="/admin/login" replace />;
//   }
  
//   // Render the protected content inside the AdminLayout
//   return (
//     <AdminLayout>
//       <Outlet />
//     </AdminLayout>
//   );
// };

// export default AdminProtectedRoute;

// src/components/admin/ProtectedAdminLayout.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
// import AdminLayout from './admin/AdminLayout';
import AdminLayout from './ AdminLayout';
import { useAuth } from '../contexts/AuthContext';

const ProtectedAdminLayout = () => {
  const { isAuthenticated } = useAuth();

  // If not logged in, kick them to /admin/login
  if (!isAuthenticated) {
    return <Navigate to="/admin/login"  />;
  }

  // Otherwise render the AdminLayout which already has its own Outlet
  return <AdminLayout />;
};

export default ProtectedAdminLayout;