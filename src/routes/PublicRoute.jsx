// src/config/routes.js
export const ROUTES = {
  PUBLIC: {
    HOME: '/',
    BOOKING: '/booking',
    BOOKING_OVERVIEW: '/booking-overview',
    CONFIRMATION: '/confirmation',
    BOOKING_CANCELLED: '/booking-cancelled',
    TERMS: '/term',
  },
  AUTH: {
    LOGIN: '/login',
    FORGOT_PASSWORD: '/forgot-password',
    VERIFY_TOKEN: '/verify-token',
    RESET_PASSWORD: '/reset-password',
  },
  PROTECTED: {
    ADMIN: '/admin',
    PROFILE: '/admin/profile',
    BOOKING_CUSTOMER: '/admin/booking/customer',
    BOOKING_CALENDAR: '/admin/booking/calender',
    SLOT_MANAGER: '/admin/booking/slotmanager',
  }
};



// // import React from "react";

// // const PublicRoute = ({ children }) => {
// //   return children;
// // };
 
// // export default PublicRoute;
// // src/routes/publicRoutes.js
// export const publicRoutes = [
//   {
//     path: '/',
//     component: 'ServiceBookingForm'
//   },
//   {
//     path: '/booking-overview',
//     component: 'BookingOverview'
//   },
//   {
//     path: '/confirmation',
//     component: 'Confirmation'
//   },
//   {
//     path: '/booking-cancelled',
//     component: 'BookingCancelled'
//   },
//   {
//     path: '/term',
//     component: 'TermsAndConditions'
//   }
// ];

// export const authRoutes = [
//   {
//     path: '/login',
//     component: 'LoginPage'
//   },
//   {
//     path: '/forgot-password',
//     component: 'ForgotPassword'
//   },
//   {
//     path: '/verify-token/:token',
//     component: 'VerifyToken'
//   },
//   {
//     path: '/reset-password/:token',
//     component: 'ResetPassword'
//   }
// ];

// export const protectedRoutes = [
//   {
//     path: '/admin/profile',
//     component: 'UserProfile'
//   },
//   {
//     path: '/admin/booking/customer',
//     component: 'BookingbyAdminForm'
//   },
//   {
//     path: '/admin/booking/calender',
//     component: 'BookingManagement'
//   },
//   {
//     path: '/admin/booking/slotmanager',
//     component: 'SlotManager'
//   }
// ];
