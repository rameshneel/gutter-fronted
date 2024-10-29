
//src/service/api.jsx
import axios from "axios";

const api = axios.create({
  //  baseURL: "https://in.prelaunchserver.com/zacks-gutter/api",
  baseURL: "https://api.zacsgutters.co.uk",
    // baseURL: "http://localhost:4000",
  withCredentials: true,
});
//********* Start *****//public no use milldware karna hai 
// Other API Functions
export const checkCustomer = async (formData) => {
  try {
    const response = await api.post("/check", formData, {
      headers: {
        'Content-Type': 'multipart/form-data', // Ensure the content type is set correctly
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
// Function to create customer
export const createCustomer = async (formData) => {
  try {
    const response = await api.post("/create", formData, {
      headers: {
        'Content-Type': 'multipart/form-data', // Ensure the content type is set correctly
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error creating customer:", error);
    throw error;
  }
};
export const capturePayment = async (paymentDetails) => {
  try {
    const response = await api.post("/capture-payment", paymentDetails);
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const cancelPayment = async (bookingId) => {
  try {
    const response = await api.post(`/${bookingId}/cancel`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

//********* End *****//public no use milldware karna hai 


//****Use Milddlewere */
// const checkAuthStatus = useCallback(async () => {
//   setLoading(true);
//   try {
//     const response = await api.post("/protected", {}, { withCredentials: true });
    
//     if (response.status === 200) {
//       setIsAuthenticated(true);
//     } else {
//       setIsAuthenticated(false);
//     }
//   } catch (error) {
//     console.error('Auth check failed:', error);
//     setIsAuthenticated(false);
//   } finally {
//     setLoading(false);
//   }
// }, []);

export const login = async (email, password) => {
  try {
    const response = await api.post("/api/users/login", { email, password });
    
    if (response.status === 200) {
      setIsAuthenticated(true);
      return { success: true };
    } else {
      return { success: false, message: response.data.message || response.statusText };
    }
  } catch (error) {
    console.error('Login error:', error);
    return { success: false, message: 'An unexpected error occurred.' };
  }
};
export const logout = async () => {
  try {
    await api.post("/api/users/logout");
    setIsAuthenticated(false);
  } catch (error) {
    console.error('Logout failed:', error);
  }
};
// Forget Password
export const forgetPassword = async (email) => {
  try {
    const response = await api.post("/api/users/forget", { email });
    return response;
  } catch (error) {
    throw error;
  }
};
// Get Reset Password Token
export const getResetPasswordToken = async (token) => {
   
  try {
    const response = await api.get(`/api/users/reset-password-token/${token}`);
    return response;
  } catch (error) {
    throw error;
  }
};
// Reset Password
export const resetPassword = async (password,confirmPassword,token) => {
  try {
    const response = await api.patch(`/api/users/reset-password/?token=${token}`,{password,confirmPassword});
    return response;
  } catch (error) {
    throw error;
  }
};
//update account password
export const updateAccount = async (fullName,email,mobileNo) => {
  try {
    const response = await api.patch(`/api/users/update-account`, {fullName,email,mobileNo});
    return response;
  } catch (error) {
    throw error;
  }
};
export const getAllDataBooking = async (pageIndex, pageSize) => {
  try {
    const response = await api.get(`/api/customers?page=${pageIndex + 1}&limit=${pageSize}`);
    return response;
  } catch (error) {
    throw error;
  }
}; 
export const getCustomerById = async (customerId) => {
  try {
    const response = await api.get(`/api/customers/${customerId}`);
    return response;
  } catch (error) {
    throw error;
  }
};
export const deleteCustomerById = async (id) => {
  try {
    const response = await api.delete(`/api/customers/${id}`);
    return response;
  } catch (error) {
    throw error;
  }
};
export const refundCustomer = async (orderId, amount,refundReason) => {
  try {
    const response = await api.post("/refund",{ captureId:orderId, refundAmount:amount,refundReason })
    return response;
  } catch (error) {
    throw error;
  }
};
export const createCustomerByAdmin = async (formData) => {
  try {
    const response = await api.post(`/api/customers/create`,formData, {
      headers: {
        'Content-Type': 'multipart/form-data', 
      },
    });
    return response;
  } catch (error) {
    throw error;
  }
};
export const UpdateCustomerByAdmin = async (customerId,formData) => {

  try {
    const response = await api.patch(`/api/customers/${customerId}`, JSON.stringify(formData), {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response
  } catch (error) {
    throw error;
  }
};
export const blockTimeSlots = async (date, slots) => {
  try {
    const response = await api.patch("/api/customers/blocktimeslots/", {
      date,
      slots,
    }, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error blocking time slots:", error);
    throw error;
  }
};
export const unblockTimeSlots = async (date, slots) => {
  try {
    const response = await api.patch("/api/customers/unblocktimeslots/", {
      date,
      slots,
    }, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response
  } catch (error) {
    throw error;
  }
};
export const getAvailableTimeSlots = async (date) => {
  try {
    const response = await api.get(`/api/customers/available/slot?date=${date}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response;
  } catch (error) {
    throw error;
  }
};
export const getAvailableTimeSlotsforForm = async (date) => {
  try {
    const response = await api.get(`/api/customers/slots/times-slots`, { params: { date } }, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response;
  } catch (error) {
    throw error;
  }
};
export const getDisabledDates = async ( year,month) => {
  try {
    const response = await api.get(`/api/customers/slots/disbale-date`, { params: {year,month }, }, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response;
  } catch (error) {
    console.error("Error fetching available time slots:", error);
    throw error;
  }
};



export default api;




























// //src/service/api.jsx
// import axios from "axios";

// const api = axios.create({
//   //  baseURL: "https://in.prelaunchserver.com/zacks-gutter/api",
//   baseURL: "https://api.zacsgutters.co.uk",
//     // baseURL: "http://localhost:4000",
//   withCredentials: true,
// });

// // let isRefreshing = false;
// // let failedQueue = [];
// // const processQueue = (error, token = null) => {
// //   failedQueue.forEach((prom) => {
// //     if (error) {
// //       prom.reject(error);
// //     } else {
// //       prom.resolve(token);
// //     }
// //   });
// //   failedQueue = [];
// // };

// // const redirectToLogin = () => {
// //   // Implement your logout logic here
// //   console.log("Redirecting to login...");
// //   localStorage.removeItem("user");
// //   window.location.href = "/login";
// // };

// // api.interceptors.response.use(
// //   (response) => response,
// //   async (error) => {
// //     const originalRequest = error.config;

// //     // Check for Unauthorized error
// //     if (error.response && error.response.status === 401 && !originalRequest._retry) {
// //       if (isRefreshing) {
// //         return new Promise((resolve, reject) => {
// //           failedQueue.push({ resolve, reject });
// //         })
// //           .then((token) => {
// //             originalRequest.headers["Authorization"] = `Bearer ${token}`;
// //             return api(originalRequest);
// //           })
// //           .catch((err) => {
// //             redirectToLogin();
// //             return Promise.reject(err);
// //           });
// //       }

// //       originalRequest._retry = true;
// //       isRefreshing = true;

// //       try {
// //         const response = await api.post("/api/refresh-token");
// //         const { accessToken } = response.data;

// //         if (!accessToken) {
// //           throw new Error("No access token returned");
// //         }

// //         api.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
// //         originalRequest.headers["Authorization"] = `Bearer ${accessToken}`;

// //         processQueue(null, accessToken);
// //         return api(originalRequest);
// //       } catch (refreshError) {
// //         processQueue(refreshError, null);
// //         console.log("Token refresh failed. Redirecting to login.");
// //         redirectToLogin();
// //         return Promise.reject(refreshError);
// //       } finally {
// //         isRefreshing = false;
// //       }
// //     } else if (originalRequest._retry) {
// //       console.log("Unauthorized request. Redirecting to login.");
// //       redirectToLogin();
// //     }

// //     return Promise.reject(error);
// //   }
// // );

// // Forget Password
// export const forgetPassword = async (email) => {
//   try {
//     const response = await api.post("/api/users/forget", { email });
//     return response;
//   } catch (error) {
//     throw error;
//   }
// };
// // Get Reset Password Token
// export const getResetPasswordToken = async (token) => {
   
//   try {
//     const response = await api.get(`/api/users/reset-password-token/${token}`);
//     return response;
//   } catch (error) {
//     throw error;
//   }
// };
// // Reset Password
// export const resetPassword = async (password,confirmPassword,token) => {
//   try {
//     const response = await api.patch(`/api/users/reset-password/?token=${token}`,{password,confirmPassword});
//     return response;
//   } catch (error) {
//     throw error;
//   }
// };
// //update account password
// export const updateAccount = async (fullName,email,mobileNo) => {
//   try {
//     const response = await api.patch(`/api/users/update-account`, {fullName,email,mobileNo});
//     return response;
//   } catch (error) {
//     throw error;
//   }
// };

// // Other API Functions
// export const checkCustomer = async (formData) => {
//   try {
//     const response = await api.post("/check", formData, {
//       headers: {
//         'Content-Type': 'multipart/form-data', // Ensure the content type is set correctly
//       },
//     });
//     return response.data;
//   } catch (error) {
//     throw error;
//   }
// };
// // Function to create customer
// export const createCustomer = async (formData) => {
//   try {
//     const response = await api.post("/create", formData, {
//       headers: {
//         'Content-Type': 'multipart/form-data', // Ensure the content type is set correctly
//       },
//     });
//     return response.data;
//   } catch (error) {
//     console.error("Error creating customer:", error);
//     throw error;
//   }
// };
// export const getAllDataBooking = async (pageIndex, pageSize) => {
//   try {
//     const response = await api.get(`/api/customers?page=${pageIndex + 1}&limit=${pageSize}`);
//     return response;
//   } catch (error) {
//     throw error;
//   }
// }; 
// export const getCustomerById = async (customerId) => {
//   try {
//     const response = await api.get(`/api/customers/${customerId}`);
//     return response;
//   } catch (error) {
//     throw error;
//   }
// };
// export const deleteCustomerById = async (id) => {
//   try {
//     const response = await api.delete(`/api/customers/${id}`);
//     return response;
//   } catch (error) {
//     throw error;
//   }
// };
// export const capturePayment = async (paymentDetails) => {
//   try {
//     const response = await api.post("/capture-payment", paymentDetails);
//     return response.data;
//   } catch (error) {
//     throw error;
//   }
// };
// export const cancelPayment = async (bookingId) => {
//   try {
//     const response = await api.post(`/${bookingId}/cancel`);
//     return response.data;
//   } catch (error) {
//     throw error;
//   }
// };
// export const refundCustomer = async (orderId, amount,refundReason) => {
//   try {
//     const response = await api.post("/refund",{ captureId:orderId, refundAmount:amount,refundReason })
//     return response;
//   } catch (error) {
//     throw error;
//   }
// };
// export const createCustomerByAdmin = async (formData) => {
//   try {
//     const response = await api.post(`/api/customers/create`,formData, {
//       headers: {
//         'Content-Type': 'multipart/form-data', 
//       },
//     });
//     return response;
//   } catch (error) {
//     throw error;
//   }
// };
// export const UpdateCustomerByAdmin = async (customerId,formData) => {

//   try {
//     const response = await api.patch(`/api/customers/${customerId}`, JSON.stringify(formData), {
//       headers: {
//         'Content-Type': 'application/json',
//       },
//     });
//     return response
//   } catch (error) {
//     throw error;
//   }
// };
// export const blockTimeSlots = async (date, slots) => {
//   try {
//     const response = await api.patch("/api/customers/blocktimeslots/", {
//       date,
//       slots,
//     }, {
//       headers: {
//         'Content-Type': 'application/json',
//       },
//     });
//     return response.data;
//   } catch (error) {
//     console.error("Error blocking time slots:", error);
//     throw error;
//   }
// };
// export const unblockTimeSlots = async (date, slots) => {
//   try {
//     const response = await api.patch("/api/customers/unblocktimeslots/", {
//       date,
//       slots,
//     }, {
//       headers: {
//         'Content-Type': 'application/json',
//       },
//     });
//     return response
//   } catch (error) {
//     throw error;
//   }
// };
// export const getAvailableTimeSlots = async (date) => {
//   try {
//     const response = await api.get(`/api/customers/available/slot?date=${date}`, {
//       headers: {
//         'Content-Type': 'application/json',
//       },
//     });
//     return response;
//   } catch (error) {
//     throw error;
//   }
// };
// export const getAvailableTimeSlotsforForm = async (date) => {
//   try {
//     const response = await api.get(`/api/customers/slots/times-slots`, { params: { date } }, {
//       headers: {
//         'Content-Type': 'application/json',
//       },
//     });
//     return response;
//   } catch (error) {
//     throw error;
//   }
// };
// export const getDisabledDates = async ( year,month) => {
//   try {
//     const response = await api.get(`/api/customers/slots/disbale-date`, { params: {year,month }, }, {
//       headers: {
//         'Content-Type': 'application/json',
//       },
//     });
//     return response;
//   } catch (error) {
//     console.error("Error fetching available time slots:", error);
//     throw error;
//   }
// };



// export default api;
























// import axios from "axios";

// const api = axios.create({
//   baseURL: "http://localhost:4000",
//   withCredentials: true
// });

// let isRefreshing = false;
// let failedQueue = [];

// const processQueue = (error, token = null) => {
//   failedQueue.forEach(prom => {
//     if (error) {
//       prom.reject(error);
//     } else {
//       prom.resolve(token);
//     }
//   });
  
//   failedQueue = [];
// };

// const redirectToLogin = () => {
//   // Implement your logout logic here
//   localStorage.removeItem('user');
//   window.location.href = '/login';
// };

// api.interceptors.response.use(
//   response => response,
//   async (error) => {
//     const originalRequest = error.config;

//     // Check for Unauthorized error
//     if (error.response && 
//         (error.response.status === 401 || 
//          (error.response.data && 
//           (error.response.data.message === "Unauthorized request" || 
//            (error.response.data.data && error.response.data.data.message === "Unauthorized request"))))) {
      
//       if (!originalRequest._retry) {
//         if (isRefreshing) {
//           return new Promise((resolve, reject) => {
//             failedQueue.push({ resolve, reject });
//           }).then(token => {
//             originalRequest.headers['Authorization'] = `Bearer ${token}`;
//             return api(originalRequest);
//           }).catch(err => {
//             redirectToLogin();
//             return Promise.reject(err);
//           });
//         }

//         originalRequest._retry = true;
//         isRefreshing = true;

//         try {
//           const response = await api.post('/api/refresh-token');
//           const { accessToken } = response.data;

//           if (!accessToken) {
//             throw new Error('No access token returned');
//           }

//           api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
//           originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;

//           processQueue(null, accessToken);
//           return api(originalRequest);
//         } catch (refreshError) {
//           processQueue(refreshError, null);
//           console.log("Token refresh failed. Redirecting to login.");
//           redirectToLogin();
//           return Promise.reject(refreshError);
//         } finally {
//           isRefreshing = false;
//         }
//       } else {
//         console.log("Unauthorized request. Redirecting to login.");
//         redirectToLogin();
//         return Promise.reject(error);
//       }
//     }

//     return Promise.reject(error);
//   }
// );

// export const getAllDataBooking = async (pageIndex, pageSize) => {
//   try {
//     const response = await api.get(`/api/customers?page=${pageIndex + 1}&limit=${pageSize}`);
//     return response.data;
//   } catch (error) {
//     console.error("Error fetching all data bookings:", error);
//     throw error;
//   }
// };

// export const getCustomerById = async (customerId) => {
//   try {
//     const response = await api.get(`/api/customers/${customerId}`);
//     return response.data;
//   } catch (error) {
//     console.error(`Error fetching customer with ID ${customerId}:`, error);
//     throw error;
//   }
// };

// export const deleteCustomerById = async (id) => {
//   try {
//     const response = await api.delete(`/api/customers/${id}`);
//     return response.data;
//   } catch (error) {
//     console.error(`Error deleting customer with ID ${id}:`, error);
//     throw error;
//   }
// };

// export const login = async (email, password) => {
//   try {
//     const response = await api.post('/api/login', { email, password });
//     // Assuming the server returns user data and tokens
//     localStorage.setItem('user', JSON.stringify(response.data.user));
//     return response.data;
//   } catch (error) {
//     console.error("Login error:", error);
//     throw error;
//   }
// };

// export const logout = async () => {
//   try {
//     await api.post('/api/logout');
//     localStorage.removeItem('user');
//   } catch (error) {
//     console.error("Logout error:", error);
//   } finally {
//     // Ensure user is redirected to login even if API call fails
//     window.location.href = '/login';
//   }
// };

// export default api;

