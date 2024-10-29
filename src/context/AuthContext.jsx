// // src/context/AuthContext.jsx
// import React, { createContext, useState, useContext, useCallback, useEffect } from 'react';
// import api from '../services/api';
// import { useNavigate, useLocation } from 'react-router-dom';
// import { ROUTES } from "../routes/PublicRoute";

// const AuthContext = createContext(null);

// const AuthProvider = ({ children }) => {
//   const [authState, setAuthState] = useState({
//     isAuthenticated: false,
//     isLoading: true,
//     user: null,
//     error: null
//   });
//   const navigate = useNavigate();
//   const location = useLocation();

//   const isProtectedRoute = useCallback((pathname) => {
//     return pathname.startsWith(ROUTES.PROTECTED.ADMIN);
//   }, []);

//   const checkAuthStatus = useCallback(async () => {
//     // Skip auth check if not on protected route
//     if (!isProtectedRoute(location.pathname)) {
//       setAuthState(prev => ({ ...prev, isLoading: false }));
//       return;
//     }

//     try {
//       const response = await api.post("/protected");
//       setAuthState(prev => ({
//         ...prev,
//         isAuthenticated: true,
//         isLoading: false,
//         error: null
//       }));
//     } catch (error) {
//       setAuthState(prev => ({
//         ...prev,
//         isAuthenticated: false,
//         isLoading: false,
//         error: error.message
//       }));

//       if (isProtectedRoute(location.pathname)) {
//         navigate(ROUTES.AUTH.LOGIN, { 
//           state: { from: location.pathname },
//           replace: true 
//         });
//       }
//     }
//   }, [navigate, location.pathname, isProtectedRoute]);

//   useEffect(() => {
//     checkAuthStatus();
//   }, [checkAuthStatus]);

//   const login = async (credentials) => {
//     try {
//       setAuthState(prev => ({ ...prev, isLoading: true }));
//       const response = await api.post("/api/users/login", credentials);
      
//       setAuthState({
//         isAuthenticated: true,
//         isLoading: false,
//         user: response.data.user,
//         error: null
//       });

//       const intendedPath = location.state?.from || ROUTES.PROTECTED.PROFILE;
//       navigate(intendedPath, { replace: true });
      
//       return { success: true };
//     } catch (error) {
//       setAuthState(prev => ({
//         ...prev,
//         isLoading: false,
//         error: error.response?.data?.message || 'Login failed'
//       }));
      
//       return { 
//         success: false, 
//         message: error.response?.data?.message || 'Login failed'
//       };
//     }
//   };

//   const logout = async () => {
//     try {
//       await api.post("/api/users/logout");
//     } catch (error) {
//       console.error('Logout failed:', error);
//     } finally {
//       setAuthState({
//         isAuthenticated: false,
//         isLoading: false,
//         user: null,
//         error: null
//       });
//       navigate(ROUTES.AUTH.LOGIN, { replace: true });
//     }
//   };

//   const clearError = () => {
//     setAuthState(prev => ({ ...prev, error: null }));
//   };

//   const value = {
//     ...authState,
//     login,
//     logout,
//     clearError,
//     checkAuthStatus
//   };

//   return (
//     <AuthContext.Provider value={value}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// // Hook with TypeScript-like runtime checks
// const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error('useAuth must be used within AuthProvider');
//   }
//   return context;
// };

// export { AuthProvider, useAuth };
// src/context/AuthContext.jsx
import React, { createContext, useState, useContext, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from "axios";

const api = axios.create({
  //  baseURL: "https://in.prelaunchserver.com/zacks-gutter/api",
  baseURL: "https://api.zacsgutters.co.uk",
    // baseURL: "http://localhost:4000",
  withCredentials: true,
});
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const checkAuthStatus = useCallback(async () => {
    try {
      const response = await api.post("/api/protected");
      setIsAuthenticated(response.status === 200);
    } catch (error) {
      setIsAuthenticated(false);
      if (window.location.pathname.startsWith('/admin')) {
        navigate('/login');
      }
    } finally {
      setIsLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  const login = async (email, password) => {
    try {
      const response = await api.post("/api/users/login", { email, password });
      if (response.status === 200) {
        setIsAuthenticated(true);
        navigate('/admin/profile');
        return { success: true };
      }
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Login failed' 
      };
    }
  };

  const logout = async () => {
    try {
      await api.post("/api/users/logout");
      setIsAuthenticated(false);
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      isLoading, 
      login, 
      logout,
      checkAuthStatus 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};



// //src/context/Authcontex.jsx

// import React, { createContext, useState, useContext, useCallback, useEffect } from 'react';
// // const BASE_URL= "https://in.prelaunchserver.com/zacks-gutter/api/api";
// const BASE_URL = "https://api.zacsgutters.co.uk/api";
//   // const  BASE_URL= "http://localhost:4000/api";

// const AuthContext = createContext(null);

// export const AuthProvider = ({ children }) => {
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const [loading, setLoading] = useState(false);

//   const checkAuthStatus = useCallback(async () => {
//     setLoading(true);
//     try {
//       const response = await fetch(`${BASE_URL}/protected`, {
//         method: 'POST',
//         credentials: 'include',
//       }); 
//       if (response.ok) {
//         setIsAuthenticated(true);
//       } else {
//         setIsAuthenticated(false);
//       }
//     } catch (error) {
//       console.error('Auth check failed:', error);
//       setIsAuthenticated(false);
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   // useEffect(() => {
//   //   checkAuthStatus(); // Initial auth check jab provider mount hota hai
//   // }, [checkAuthStatus]);

//   const login = async (email, password) => {
//     try {
//       const response = await fetch(`${BASE_URL}/users/login`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ email, password }),
//         credentials: 'include',
//       });

//       if (response.ok) {
//         setIsAuthenticated(true);
//         return { success: true };
//       } else {
//         const errorData = await response.json();
//         return { success: false, message: errorData.message || response.statusText };
//       }
//     } catch (error) {
//       console.error('Login error:', error);
//       return { success: false, message: 'An unexpected error occurred.' };
//     }
//   };

//   const logout = async () => {
//     try {
//       await fetch(`${BASE_URL}/users/logout`, {
//         method: 'POST',
//         credentials: 'include',
//       });
//       setIsAuthenticated(false);
//     } catch (error) {
//       console.error('Logout failed:', error);
//     }
//   };

//   return (
//     <AuthContext.Provider value={{ isAuthenticated, loading, checkAuthStatus, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => useContext(AuthContext);

// import React, { createContext, useState, useContext, useCallback } from 'react';

// const BASE_URL = "http://localhost:4000/api";

// const AuthContext = createContext(null);

// export const AuthProvider = ({ children }) => {
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const [loading, setLoading] = useState(false);

//   const checkAuthStatus = useCallback(async () => {
//     setLoading(true);
//     try {
//       const response = await fetch(`${BASE_URL}/protected`, {
//         method: 'POST',
//         credentials: 'include',
//       });

//       if (response.ok) {
//         setIsAuthenticated(true);
//       } else {
//         setIsAuthenticated(false);
//       }
//     } catch (error) {
//       console.error('Auth check failed:', error);
//       setIsAuthenticated(false);
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   const login = async (email, password) => {
//     try {
//       const response = await fetch(`${BASE_URL}/users/login`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ email, password }),
//         credentials: 'include',
//       });

//       if (response.ok) {
//         setIsAuthenticated(true);
//         return true;
//       } else {
//         console.error('Login failed:', response.statusText);
//       }
//     } catch (error) {
//       console.error('Login error:', error);
//     }

//     return false;
//   };

//   const logout = async () => {
//     try {
//       await fetch(`${BASE_URL}/users/logout`, {
//         method: 'POST',
//         credentials: 'include',
//       });
//       setIsAuthenticated(false);
//     } catch (error) {
//       console.error('Logout failed:', error);
//     }
//   };

//   return (
//     <AuthContext.Provider value={{ isAuthenticated, loading, checkAuthStatus, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => useContext(AuthContext);











// import React, { useState, useCallback, useEffect } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import { motion } from "framer-motion";
// import { ChevronDownIcon } from "@heroicons/react/24/solid";
// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";
// import { checkCustomer } from "../../services/api"; 
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import Select from "react-select";
// import { calculateTotalPrice } from "../../utils/priceCalculator";
// import { addDays } from "date-fns";
// import HomeStyleModal from "./HomeStyleModal";

// // Function to check if a date is a weekday
// const isWeekday = (date) => {
//   const day = date.getDay();
//   return day !== 0 && day !== 6;
// };

// const InputField = ({
//   label,
//   name,
//   type = "text",
//   value,
//   onChange,
//   required,
//   error,
// }) => (
//   <div className="relative">
//     <input
//       type={type}
//       name={name}
//       id={name}
//       value={value}
//       onChange={onChange}
//       className={`peer h-10 w-full border-b-2 px-2 border-gray-300 text-gray-900 placeholder-transparent focus:outline-none focus:border-blue-500 ${
//         error ? "border-red-500" : ""
//       }`}
//       placeholder={label}
//       required={required}
//     />
//     <label
//       htmlFor={name}
//       className={`absolute left-0 -top-3.5 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-sm ${
//         error
//           ? "text-red-500"
//           : "text-gray-600 peer-placeholder-shown:text-gray-400 peer-focus:text-gray-600"
//       }`}
//     >
//       {label}
//     </label>
//     {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
//   </div>
// );

// const SelectField = ({
//   label,
//   name,
//   value,
//   onChange,
//   options,
//   required,
//   error,
// }) => (
//   <div className="relative">
//     <select
//       name={name}
//       id={name}
//       value={value}
//       onChange={onChange}
//       className={`peer h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:border-blue-500 appearance-none ${
//         error ? "border-red-500" : ""
//       }`}
//       required={required}
//     >
//       <option value="" disabled hidden>
//         Select {label}
//       </option>
//       {options.map((option) => (
//         <option key={option.value} value={option.value}>
//           {option.label}
//         </option>
//       ))}
//     </select>
//     <label
//       htmlFor={name}
//       className={`absolute left-0 -top-3.5 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-sm ${
//         error
//           ? "text-red-500"
//           : "text-gray-600 peer-placeholder-shown:text-gray-400 peer-focus:text-gray-600"
//       }`}
//     >
//       {label}
//     </label>
//     <ChevronDownIcon className="absolute right-0 top-3 h-5 w-5 text-gray-400 pointer-events-none" />
//     {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
//   </div>
// );

// const INITIAL_FORM_STATE = {
//   customerName: "",
//   email: "",
//   contactNumber: "",
//   firstLineOfAddress: "",
//   town: "",
//   postcode: "",
//   selectedDate: null,
//   selectedTimeSlot: "",
//   selectService: "",
//   selectHomeType: "",
//   selectHomeStyle: "",
//   gutterCleaningOptions: [],
//   gutterRepairsOptions: [],
//   message: "",
//   paymentMethod: "",
// };

// const GUTTER_CLEANING_OPTIONS = [
//   { value: "Garage", label: "Garage" },
//   { value: "Conservatory", label: "Conservatory" },
//   { value: "Extension", label: "Extension" },
// ];

// const GUTTER_REPAIRS_OPTIONS = [
//   { value: "Running Outlet", label: "Running Outlet" },
//   { value: "Union Joint", label: "Union Joint" },
//   { value: "Corner", label: "Corner" },
//   { value: "Gutter Bracket", label: "Gutter Bracket" },
//   { value: "Downpipe", label: "Downpipe" },
//   {
//     value: "Gutter Length Replacement",
//     label: "Gutter Length Replacement",
//   },
// ];

// const TIME_SLOT_OPTIONS = [
//   { value: "9:00-9:45 AM", label: "9:00-9:45 AM" },
//   { value: "9:45-10:30 AM", label: "9:45-10:30 AM" },
//   { value: "10:30-11:15 AM", label: "10:30-11:15 AM" },
//   { value: "11:15-12:00 PM", label: "11:15-12:00 PM" },
//   { value: "12:00-12:45 PM", label: "12:00-12:45 PM" },
//   { value: "12:45-1:30 PM", label: "12:45-1:30 PM" },
//   { value: "1:30-2:15 PM", label: "1:30-2:15 PM" },
//   { value: "2:15-3:00 PM", label: "2:15-3:00 PM" },
// ];

// const SERVICE_OPTIONS = [
//   { value: "Gutter Cleaning", label: "Gutter Cleaning" },
//   { value: "Gutter Repair", label: "Gutter Repair" },
// ];

// const PROPERTY_TYPE_OPTIONS = [
//   { value: "Bungalow", label: "Bungalow" },
//   { value: "2 Bedroom", label: "2 Bedroom" },
//   { value: "3 Bedroom", label: "3 Bedroom" }, 
//   { value: "4 Bedroom", label: "4 Bedroom" },
//   { value: "5 Bedroom", label: "5 Bedroom" },
//   { value: "Town House/3 Stories", label: "Town House/3 Stories" },
// ];

// const PROPERTY_STYLE_OPTIONS = [
//   { value: "Terrace", label: "Terrace" },
//   { value: "Semi-Detached", label: "Semi-Detached" },
//   { value: "Detached", label: "Detached" },
// ];

// const ServiceBookingForm = () => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const [formData, setFormData] = useState(INITIAL_FORM_STATE);
//   const [errors, setErrors] = useState({});
//   const [totalPrice, setTotalPrice] = useState(0);
//   const [showHomeStyleModal, setShowHomeStyleModal] = useState(false);

//   useEffect(() => {
//     if (location.state && location.state.formData) {
//       setFormData(location.state.formData);
//     }
//   }, [location.state]);
//   useEffect(() => {
//     if (Object.keys(formData).length > 0) {
//       const newTotalPrice = calculateTotalPrice(formData);
//       setTotalPrice(newTotalPrice);
//     }
//   }, [formData]);

//   console.log("form price ",totalPrice);
  
//   const handleInputChange = useCallback(
//     (e) => {
//       const { name, value } = e.target;
//       const uppercasedValue = name === "postcode" ? value.toUpperCase() : value;

//       setFormData((prevState) => {
//         const newFormData = { ...prevState, [name]: uppercasedValue };
//         const newTotalPrice = calculateTotalPrice(newFormData);
//         setTotalPrice(newTotalPrice);

//         if (name === "postcode") {
//           const validPostcodes = ["RH10", "RH11", "RH12", "RH13"];
//           const prefix = uppercasedValue.substring(0, 4); // Ensure prefix is uppercase
//           if (!validPostcodes.includes(prefix)) {
//             setErrors((prevErrors) => ({
//               ...prevErrors,
//               postcode: "Currently we only serve postcodes RH10, RH11, RH12, and RH13",
//             }));
//           } else {
//             setErrors((prevErrors) => ({
//               ...prevErrors,
//               postcode: "",
//             }));
//           }
//         } else if (errors[name]) {
//           setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
//         }

//         return newFormData;
//       });
//     },
//     [errors, calculateTotalPrice]
//   ); 
//   const handleServiceChange = (selectedOption) => {
//     setFormData((prevState) => {
//       const newFormData = {
//         ...prevState,
//         selectService: selectedOption.value,
//         gutterCleaningOptions: [],
//         gutterRepairsOptions: [],
//       };
//       const newTotalPrice = calculateTotalPrice(newFormData);
//       setTotalPrice(newTotalPrice);
//       return newFormData;
//     });
//   };
//   const handleOptionChange = (selectedOptions, serviceType) => {
//     setFormData((prevState) => ({
//       ...prevState,
//       [serviceType]: selectedOptions,
//     }));
//   };
//   const handleDateChange = useCallback(
//     (date) => {
//       // console.log("Selected Date:", date);
//       // Date ko local time zone mein convert karna
//       const localDate = new Date(date);

//       // Local date ko UTC date mein convert karna
//       const utcDate = new Date(
//         localDate.getTime() - localDate.getTimezoneOffset() * 60000
//       );

//       const UTC_date = utcDate.toISOString();
//       // console.log(UTC_date);

//       // Local time zone mein display ke liye adjust karna
//       const localFormattedDate = localDate.toLocaleString();
//       // console.log("Local Formatted Date:", localFormattedDate);
//       setFormData((prevState) => ({
//         ...prevState,
//         selectedDate: UTC_date,
//       }));
//       if (errors.selectedDate) {
//         setErrors((prevErrors) => ({ ...prevErrors, selectedDate: "" }));
//       }
//     },
//     [errors]
//   );
//   const validateForm = useCallback(() => {
//     const newErrors = {};
//     Object.keys(formData).forEach((key) => {
//       if (
//         formData[key] === "" &&
//         key !== "file" && 
//         key !== "message" &&
//         key !== "gutterCleaningOptions"
//       ) {
//         newErrors[key] = "This field is required";
//       }
//     });
//     if (!formData.selectedDate) {
//       newErrors.selectedDate = "Please select a date";
//     }
//     if (
//       formData.selectService === "Gutter Repair" &&
//       formData.gutterRepairsOptions.length === 0
//     ) {
//       newErrors.gutterRepairsOptions =
//         "Please select at least one repair service";
//     }
//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   }, [formData]);

//   const handleSubmit = useCallback(
//     async (e) => {
//       e.preventDefault();
//       const formDataWithPrice = { ...formData, totalPrice };
//       console.log("Form Data with Total Price / home par :", formDataWithPrice);

//       if (!formDataWithPrice) {
//         toast.error("No booking data available.");
//         return;
//       }
//       if (!validateForm()) {
//         toast.error("Please correct the form errors before submitting.");
//         const firstErrorField = Object.keys(errors)[0];
//         const errorElement = document.getElementById(firstErrorField);
//         if (errorElement) {
//           errorElement.scrollIntoView({ behavior: "smooth", block: "center" });
//         }
//         return;
//       }

//       // Perform the API request and handle the response
//       try {
//         const response = await checkCustomer(formDataWithPrice);
//         // console.log("responce",response)
//         if (response.success) {
//           toast.success("Customer check successful!");
//           navigate("/booking-overview", {
//             state: { formData: formDataWithPrice },
//           });
//         } else {
//           toast.error(
//             response.message || "An error occurred while checking the customer."
//           );
//         }
//       } catch (error) {
//         console.error("Error:", error);
//         toast.error(
//           error.response?.data?.message ||
//             "An unexpected error occurred. Please try again later."
//         );
//       }
//     },
//     [formData, totalPrice, errors, navigate, validateForm]
//   );

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-100 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.5 }}
//         className="max-w-3xl mx-auto bg-white rounded-lg shadow-xl overflow-hidden"
//       >
//         <div className="px-4 py-5 sm:p-6">
//           <h1 className="text-3xl font-extrabold text-center text-gray-900 mb-8">
//             {location.state && location.state.formData
//               ? "Edit Your Booking"
//               : "Book Your Service"}
//           </h1>
//           <form onSubmit={handleSubmit} className="space-y-6" noValidate>
//             <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
//               <InputField
//                 label="Name"
//                 name="customerName"
//                 value={formData.customerName}
//                 onChange={handleInputChange}
//                 required
//                 error={errors.customerName}
//               />
//               <InputField
//                 label="Email"
//                 name="email"
//                 type="email"
//                 value={formData.email}
//                 onChange={handleInputChange}
//                 required
//                 error={errors.email}
//               />
//               <InputField
//                 label="Contact Number"
//                 name="contactNumber"
//                 value={formData.contactNumber}
//                 onChange={handleInputChange}
//                 required
//                 error={errors.contactNumber}
//               />
//               <InputField
//                 label="First Line of Address"
//                 name="firstLineOfAddress"
//                 value={formData.firstLineOfAddress}
//                 onChange={handleInputChange}
//                 required
//                 error={errors.firstLineOfAddress}
//               />
//               <InputField
//                 label="Town"
//                 name="town"
//                 value={formData.town}
//                 onChange={handleInputChange}
//                 required
//                 error={errors.town}
//               />
//               <InputField
//                 label="Postcode"
//                 name="postcode"
//                 value={formData.postcode}
//                 onChange={handleInputChange}
//                 required
//                 error={errors.postcode}
                
//               />
//             </div>
//             <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
//               <div className="relative">
//                 <DatePicker
//                   selected={formData.selectedDate}
//                   dateFormat="dd/MM/yyyy"
//                   onChange={handleDateChange}
//                   minDate={addDays(new Date(), 1)}
//                   filterDate={isWeekday}
//                   className={`peer h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:border-blue-500 ${
//                     errors.selectedDate ? "border-red-500" : ""
//                   }`}
//                   placeholderText="Select Date"
//                   required
//                 />
//                 <label
//                   className={`absolute left-0 -top-3.5 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-sm ${
//                     errors.selectedDate
//                       ? "text-red-500"
//                       : "text-gray-600 peer-placeholder-shown:text-gray-400 peer-focus:text-gray-600"
//                   }`}
//                 >
//                   Date
//                 </label>
//                 {errors.selectedDate && (
//                   <p className="mt-1 text-xs text-red-500">
//                     {errors.selectedDate}
//                   </p>
//                 )}
//               </div>
//               <SelectField
//                 label="Time Slot"
//                 name="selectedTimeSlot"
//                 value={formData.selectedTimeSlot}
//                 onChange={handleInputChange}
//                 options={TIME_SLOT_OPTIONS}
//                 required
//                 error={errors.selectedTimeSlot}
//               />
//             </div>
//             <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
//               <div className="form-group">
//                 <label className="block text-sm font-medium text-gray-700">
//                   Select Service
//                 </label>
//                 <Select
//                   options={SERVICE_OPTIONS}
//                   onChange={handleServiceChange}
//                   className="mt-1"
//                   value={SERVICE_OPTIONS.find(
//                     (option) => option.value === formData.selectService
//                   )}
//                 />
//                   {/* <Select
//                  options={SERVICE_OPTIONS}
//                 onChange={(selectedOption) =>
//                   handleInputChange({
//                     target: {
//                       name: "selectHomeStyle",
//                       value: selectedOption.value,
//                     },
//                   })
//                 }
//                 value={SERVICE_OPTIONS.find(
//                   (option) => option.value === formData.selectService
//                 )}
//                 className="mt-1"
//                 isClearable
//               /> */}
//               </div>

//               {formData.selectService === "Gutter Cleaning" && (
//                 <div className="form-group mt-4">
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Do you also need Gutter Cleaning for below.
//                   </label>
//                   <div className="space-y-2">
//                     {GUTTER_CLEANING_OPTIONS.map((option) => (
//                       <div key={option.value} className="flex items-center">
//                         <input
//                           type="checkbox"
//                           id={option.value}
//                           value={option.value}
//                           checked={formData.gutterCleaningOptions.includes(
//                             option.value
//                           )}
//                           onChange={(e) => {
//                             const isChecked = e.target.checked;
//                             handleOptionChange(
//                               isChecked
//                                 ? [
//                                     ...formData.gutterCleaningOptions,
//                                     option.value,
//                                   ]
//                                 : formData.gutterCleaningOptions.filter(
//                                     (val) => val !== option.value
//                                   ),
//                               "gutterCleaningOptions"
//                             );
//                           }}
//                           className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
//                         />
//                         <label
//                           htmlFor={option.value}
//                           className="ml-2 block text-sm text-gray-900"
//                         >
//                           {option.label}
//                         </label>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               )}

//               {formData.selectService === "Gutter Repair" && (
//                 <div className="form-group mt-4">
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Select the services
//                   </label>
//                   <div className="space-y-2">
//                     {GUTTER_REPAIRS_OPTIONS.map((option) => (
//                       <div key={option.value} className="flex items-center">
//                         <input
//                           type="checkbox"
//                           id={option.value}
//                           value={option.value}
//                           checked={formData.gutterRepairsOptions.includes(
//                             option.value
//                           )}
//                           onChange={(e) => {
//                             const isChecked = e.target.checked;
//                             handleOptionChange(
//                               isChecked
//                                 ? [
//                                     ...formData.gutterRepairsOptions,
//                                     option.value,
//                                   ]
//                                 : formData.gutterRepairsOptions.filter(
//                                     (val) => val !== option.value
//                                   ),
//                               "gutterRepairsOptions"
//                             );
//                           }}
//                           className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
//                         />
//                         <label
//                           htmlFor={option.value}
//                           className="ml-2 block text-sm text-gray-900"
//                         >
//                           {option.label}
//                         </label>
//                       </div>
//                     ))}
//                   </div>
//                   {errors.gutterRepairsOptions && (
//                     <p className="mt-1 text-xs text-red-500">
//                       {errors.gutterRepairsOptions}
//                     </p>
//                   )}
//                 </div>
//               )}
//               <SelectField
//                 label="Home Type"
//                 name="selectHomeType"
//                 value={formData.selectHomeType}
//                 onChange={handleInputChange}
//                 options={PROPERTY_TYPE_OPTIONS}
//                 required
//                 error={errors.selectHomeType}
//               />
//               <div className="form-group">
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Home Style 
//               </label>
//               <Select
//                 options={PROPERTY_STYLE_OPTIONS}
//                 onChange={(selectedOption) =>
//                   handleInputChange({
//                     target: {
//                       name: "selectHomeStyle",
//                       value: selectedOption.value,
//                     },
//                   })
//                 }
//                 value={PROPERTY_STYLE_OPTIONS.find(
//                   (option) => option.value === formData.selectHomeStyle
//                 )}
//                 className="mt-1"
//                 isClearable
//               />
//               {/* <button
//                 type="button"
//                 onClick={() => setShowHomeStyleModal(true)}
//                 className="mt-2 text-l text-red-500 hover:text-blue-800 focus:outline-none"
//               >
//                 Click to view the home styles
//               </button> */}
//             </div>
//             </div>

//             <div>
//               <label
//                 htmlFor="message"
//                 className="block text-sm font-medium text-gray-700 mb-1"
//               >
//                 Additional Information (optional)
//               </label>
//               <textarea
//                 id="message"
//                 name="message"
//                 rows={3}
//                 value={formData.message}
//                 onChange={handleInputChange}
//                 className=" px-2 py-2 shadow-sm focus:ring-blue-500 focus:border-blue-500 mt-1 block w-full sm:text-sm border border-gray-300 rounded-md"
//               />
//             </div>

//             <SelectField
//               label="Payment Method"
//               name="paymentMethod"
//               value={formData.paymentMethod}
//               onChange={handleInputChange}
//               options={[{ value: "PayPal", label: "PayPal" }]}
//               error={errors.paymentMethod}
//               required
//             />

//             <div>
//               <div className="mt-6 mb-4 p-4 bg-gray-100 rounded-md shadow-sm">
//                 <div className="flex justify-between items-center">
//                   <h3 className="text-lg font-medium text-gray-900">
//                     Total Price:
//                   </h3>
//                   <span className="text-2xl font-bold text-blue-600">
//                     £{totalPrice}
//                   </span>
//                 </div>
//               </div>
//               <motion.button
//                 whileHover={{ scale: 1.05 }}
//                 whileTap={{ scale: 0.95 }}
//                 type="submit"
//                 className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
//               >
//                 {location.state && location.state.formData
//                   ? "Update Booking"
//                   : "Review Booking"}
//               </motion.button>
//             </div>
//           </form>
//           <HomeStyleModal isOpen={showHomeStyleModal} onClose={() => setShowHomeStyleModal(false)} />
//         </div>
//       </motion.div>
//       <ToastContainer position="top-center" autoClose={5000} />
//     </div>
//   );
// };

// export default ServiceBookingForm;










// import { createContext, useContext, useState, useEffect } from 'react';

// const AuthContext = createContext();

// export function useAuth() {
//   return useContext(AuthContext);
// }

// export function AuthProvider({ children }) {
//   const [isAuthenticated, setIsAuthenticated] = useState(() => {
//     const storedAuth = localStorage.getItem('isAuthenticated');
//     return storedAuth ? JSON.parse(storedAuth) : false;
//   });
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     // Simulate a check with backend or cookie/session data
//     const checkAuthStatus = () => {
//       // Normally you'd check with an API or cookies
//       const storedAuth = localStorage.getItem('isAuthenticated');
//       if (storedAuth) {
//         setIsAuthenticated(JSON.parse(storedAuth));
//       }
//       setLoading(false);
//     };
    
//     checkAuthStatus();
//   }, []);

//   const login = () => {
//     setIsAuthenticated(true);
//     localStorage.setItem('isAuthenticated', true);
//   };

//   const logout = () => {
//     setIsAuthenticated(false);
//     localStorage.removeItem('isAuthenticated');
//   };

//   const value = {
//     isAuthenticated,
//     loading,
//     login,
//     logout,
//   };

//   return (
//     <AuthContext.Provider value={value}>
//       {children}
//     </AuthContext.Provider>
//   );
// }
