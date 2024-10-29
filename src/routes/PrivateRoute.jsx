// src/components/PrivateRoute.jsx
// import React from 'react';
// import { Navigate, Outlet, useLocation } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext';
// import { ROUTES } from './PublicRoute';
// import Loading from './Loading';

// const PrivateRoute = () => {
//   const { isAuthenticated, isLoading } = useAuth();
//   const location = useLocation();

//   if (isLoading) {
//     return <Loading />;
//   }

//   return isAuthenticated ? (
//     <Outlet />
//   ) : (
//     <Navigate 
//       to={ROUTES.AUTH.LOGIN} 
//       state={{ from: location.pathname }}
//       replace 
//     />
//   );
// };

// export default PrivateRoute;

// src/components/PrivateRoute.jsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Loading from './Loading'; // Your loading component

const PrivateRoute = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <Loading />;
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;
// import React, { useEffect } from 'react';
// import { Navigate, Outlet } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext';

// const PrivateRoute = () => {
//   const { isAuthenticated, loading, checkAuthStatus } = useAuth();

//   useEffect(() => {
//     if (!isAuthenticated && !loading) {
//       checkAuthStatus();
//     }
//   }, [isAuthenticated, loading, checkAuthStatus]);

//   if (loading) {
//     return <div>Loading...</div>; // Loading indicator dikhata hai
//   }

//   return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
// };

// export default PrivateRoute;



// import React, { useEffect } from 'react';
// import { Navigate, Outlet } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext';

// const PrivateRoute = () => {
//   const { isAuthenticated, loading, checkAuthStatus } = useAuth();

//   useEffect(() => {
//     if (!loading) {
//       checkAuthStatus();
//     }
//   }, [loading, checkAuthStatus]);

//   if (loading) {
//     return <div>Loading...</div>; // Show loading indicator while checking auth status
//   }

//   return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
// };

// export default PrivateRoute;


// import React from 'react';
// import { Navigate, Outlet } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext';

// const ProtectedAdminRoute = () => {
//   const { isAuthenticated, loading } = useAuth();

//   if (loading) {
//     return <div>Loading...</div>; // You can replace this with a spinner or loader component
//   }

//   return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
// };

// export default ProtectedAdminRoute;


