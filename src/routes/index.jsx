
// // src/App.jsx
// import React, { lazy, Suspense } from 'react';
// import { Routes, Route, Navigate, BrowserRouter } from 'react-router-dom';
// import { ROUTES } from './PublicRoute';
// import PrivateRoute from './PrivateRoute';
// import Loading from './Loading';

// // Lazy load components
// const ServiceBookingForm = lazy(() =>
//   import("../components/ServiceBookingForm/index")
// );
// const BookingCancelled = lazy(() => import("../pages/BookingCancelled"));
// const BookingOverview = lazy(() => import("../components/BookingOverview"));
// const LoginPage = lazy(() => import("../components/Admin/LoginPage"));
// const ForgotPassword = lazy(() => import("../components/Admin/ForgotPassword"));
// const ResetPassword = lazy(() => import("../components/Admin/ResetPassword"));
// const VerifyToken = lazy(() => import("../components/Admin/VerifyToken"));
// const CustomerList = lazy(() => import("../components/Admin/CustomerList"));
// const DashboardLayout = lazy(() =>
//   import("../components/Admin/DashboardLayout")
// );
// const UserProfile = lazy(() => import("../components/Admin/UserProfile"));
// const Confirmation = lazy(() => import("../pages/Confirmation"));
// const TermsAndConditions = lazy(() =>
//   import("../components/ServiceBookingForm/TermsAndConditions")
// );
// const BookingbyAdminForm = lazy(() =>
//   import("../components/Admin/BookingbyAdminForm")
// );
// const BookingManagement = lazy(() =>
//   import("../components/Admin/BookingManagement")
// );
// const SlotManager = lazy(() => import("../components/Admin/SlotManager"));

// const AppRoutes = () => {
//   return (
//     <BrowserRouter>
//     <Routes>
//       {/* Public Routes */}
//       <Route path={ROUTES.PUBLIC.HOME} element={<ServiceBookingForm />} />
//       <Route path={ROUTES.PUBLIC.BOOKING_OVERVIEW} element={<BookingOverview />} />           
//       <Route path={ROUTES.PUBLIC.CONFIRMATION} element={<Confirmation />} />             
//       <Route path={ROUTES.PUBLIC.BOOKING_CANCELLED} element={<BookingCancelled />} />             
//       <Route path={ROUTES.PUBLIC.TERMS} element={<TermsAndConditions />} />

//       {/* Auth Routes */}
//       <Route path={ROUTES.AUTH.LOGIN} element={<LoginPage />} />
//       <Route path={ROUTES.AUTH.FORGOT_PASSWORD} element={<ForgotPassword />} />
//       <Route path={ROUTES.AUTH.VERIFY_TOKEN} element={<VerifyToken />} />
//       <Route path={ROUTES.AUTH.RESET_PASSWORD} element={<ResetPassword />} />

//       {/* Protected Routes */}
//       <Route element={<PrivateRoute />}>
//         <Route path={ROUTES.PROTECTED.ADMIN} element={<DashboardLayout />}>
//           <Route path={ROUTES.PROTECTED.PROFILE} element={<UserProfile />} />
//           <Route path={ROUTES.PROTECTED.BOOKING_CUSTOMER} element={<BookingbyAdminForm />} />
//           <Route path={ROUTES.PROTECTED.BOOKING_CALENDAR} element={<BookingManagement />} />
//           <Route path={ROUTES.PROTECTED.SLOT_MANAGER} element={<SlotManager />} />
//         </Route>
//       </Route>

//       {/* Catch all route */}
//       <Route path="*" element={<Navigate to={ROUTES.PUBLIC.HOME} replace />} />
//     </Routes>
//     </BrowserRouter>
//   );
// };

// export default AppRoutes;


import React, { lazy, Suspense } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider } from "../context/AuthContext";
import PrivateRoute from "./PrivateRoute";
import Loading from "./Loading";

const ServiceBookingForm = lazy(() =>
  import("../components/ServiceBookingForm/index")
);
const BookingCancelled = lazy(() => import("../pages/BookingCancelled"));
const BookingOverview = lazy(() => import("../components/BookingOverview"));
const LoginPage = lazy(() => import("../components/Admin/LoginPage"));
const ForgotPassword = lazy(() => import("../components/Admin/ForgotPassword"));
const ResetPassword = lazy(() => import("../components/Admin/ResetPassword"));
const VerifyToken = lazy(() => import("../components/Admin/VerifyToken"));
const CustomerList = lazy(() => import("../components/Admin/CustomerList"));
const DashboardLayout = lazy(() =>
  import("../components/Admin/DashboardLayout")
);
const UserProfile = lazy(() => import("../components/Admin/UserProfile"));
const Confirmation = lazy(() => import("../pages/Confirmation"));
const TermsAndConditions = lazy(() =>
  import("../components/ServiceBookingForm/TermsAndConditions")
);
const BookingbyAdminForm = lazy(() =>
  import("../components/Admin/BookingbyAdminForm")
);
const BookingManagement = lazy(() =>
  import("../components/Admin/BookingManagement")
);
const SlotManager = lazy(() => import("../components/Admin/SlotManager"));

const AppRoutes = () => {
  return (
    <BrowserRouter basename="/booking/">
      <AuthProvider>
        <Suspense fallback={<Loading />}>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<ServiceBookingForm />} />
            <Route path="booking-overview" element={<BookingOverview />} />
            <Route path="confirmation" element={<Confirmation />} />
            <Route path="booking-cancelled" element={<BookingCancelled />} />
            <Route path="term" element={<TermsAndConditions />} />

            {/* Authentication Routes */}
            <Route path="login" element={<LoginPage />} />
            <Route path="forgot-password" element={<ForgotPassword />} />
            <Route path="verify-token/:token" element={<VerifyToken />} />
            <Route path="reset-password/:token" element={<ResetPassword />} />

            {/* Admin Routes */}
            <Route element={<PrivateRoute />}>
              <Route path="/admin/*" element={<DashboardLayout />}>
                <Route path="profile" element={<UserProfile />} />
                <Route
                  path="booking/customer"
                  element={<BookingbyAdminForm />}
                />
                <Route
                  path="booking/calender"
                  element={<BookingManagement />}
                />
                <Route path="booking/slotmanager" element={<SlotManager />} />
              </Route>
            </Route>

            {/* Redirect unknown routes to home or a 404 page */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Suspense>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default AppRoutes;

// import React from "react";
// import {
//   BrowserRouter as Router,
//   Routes,
//   Route,
//   Outlet,
//   Navigate,
//   BrowserRouter,
// } from "react-router-dom";

// import ServiceBookingForm from "../components/ServiceBookingForm/index";
// import BookingCancelled from "../pages/BookingCancelled";
// import BookingOverview from "../components/BookingOverview";
// import LoginPage from "../components/Admin/LoginPage";
// import ForgotPassword from "../components/Admin/ForgotPassword";
// import ResetPassword from "../components/Admin/ResetPassword";
// import VerifyToken from "../components/Admin/VerifyToken";
// import CustomerList from "../components/Admin/CustomerList";
// import DashboardLayout from "../components/Admin/DashboardLayout";
// import UserProfile from "../components/Admin/UserProfile";
// import { AuthProvider } from "../context/AuthContext";
// import PrivateRoute from "./PrivateRoute";
// import Confirmation from "../pages/Confirmation";
// import TermsAndConditions from "../components/ServiceBookingForm/TermsAndConditions";
// import BookingbyAdminForm from "../components/Admin/BookingbyAdminForm";
// import BookingCalendar from "../components/Admin/BookingCalendar";
// import BookingManagement from "../components/Admin/BookingManagement";
// import SlotManager from "../components/Admin/SlotManager";

// const AppRoutes = () => {
//   return (
//     <BrowserRouter basename="/booking/">
//       <AuthProvider>
//         <Routes>
//           {/* Public Routes */}
//           <Route path="/" element={<ServiceBookingForm />} />
//           <Route path="booking-overview" element={<BookingOverview />} />
//           <Route path="confirmation" element={<Confirmation />} />
//           <Route path="booking-cancelled" element={<BookingCancelled />} />
//           <Route path="term" element={<TermsAndConditions/>} />

//           {/* Authentication Routes */}
//           <Route path="login" element={<LoginPage />} />
//           <Route path="forgot-password" element={<ForgotPassword />} />
//           <Route path="verify-token/:token" element={<VerifyToken />} />
//           <Route path="reset-password/:token" element={<ResetPassword />} />

//           {/* Protected Admin Routes */}
//           {/* <Route element={<PrivateRoute />}>
//             <Route path="/admin" element={<DashboardLayout />}>
//               <Route index element={<Navigate to="booking" />} />
//               <Route path="booking" element={<CustomerList />} />
//               <Route path="profile" element={<UserProfile />} />
//             </Route>
//           </Route> */}

//           {/* Admin Routes */}

//           <Route path="/admin" element={<DashboardLayout />}>
//             {/* Protected Routes */}
//             <Route element={<PrivateRoute />}>
//               {/* <Route path="booking" element={<CustomerList />} /> */}
//               <Route path="profile" element={<UserProfile />} />
//               <Route path="booking/customer" element={<BookingbyAdminForm />} />
//               <Route path="booking/calender" element={<BookingManagement />} />
//               <Route path="booking/slotmanager" element={<SlotManager />} />
//             </Route>
//           </Route>

//           {/* Redirect unknown routes to home or a 404 page */}
//           <Route path="*" element={<Navigate to="/" />} />
//         </Routes>
//       </AuthProvider>
//     </BrowserRouter>
//   );
// };

// export default AppRoutes;
