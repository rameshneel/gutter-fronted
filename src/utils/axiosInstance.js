// // src/utils/axiosInstance.js
// import axios from 'axios';

// const axiosInstance = axios.create({
//   // baseURL: 'https://in.prelaunchserver.com/zacks-gutter/api',
//    baseURL: "http://localhost:4000",
//   withCredentials: true, // Cookies automatically include karne ke liye
// });

// // Interceptor for handling token refresh
// axiosInstance.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     const originalRequest = error.config;

//     // If the error is due to an expired token (assuming your server sends a specific status code for this)
//     if (error.response.status === 401 && !originalRequest._retry) {
//       originalRequest._retry = true;

//       try {
//         // Call your refresh token endpoint
//         await axiosInstance.post('/api/refresh-token');
        
//         // Retry the original request
//         return axiosInstance(originalRequest);
//       } catch (refreshError) {
//         // If refresh fails, redirect to login
//         window.location.href = '/login';
//         return Promise.reject(refreshError);
//       }
//     }

//     return Promise.reject(error);
//   }
// );

// export default axiosInstance;


// // src/utils/axiosInstance.js
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';

// const axiosInstance = axios.create({
//   baseURL: 'http://localhost:4000', // Backend server ka base URL
//   withCredentials: true, // Cookies automatically include karne ke liye
// });

// // Utility function to handle navigation
// const navigateToLogin = () => {
//   const navigate = useNavigate();
//   navigate('/admin/login');
// };

// axiosInstance.interceptors.response.use(
//   response => response,
//   async (error) => {
//     const originalRequest = error.config;

//     if (error.response.status === 401 && !originalRequest._retry) {
//       originalRequest._retry = true;

//       try {
//         // Refresh the token
//         const response = await axiosInstance.post('/api/refresh-token');
//         const { accessToken } = response.data;

//         // Set new access token in headers
//         axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
//         originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;

//         // Retry the original request
//         return axiosInstance(originalRequest);
//       } catch (err) {
//         // Redirect to login if refresh token also expired
//         navigateToLogin();
//         return Promise.reject(err);
//       }
//     }

//     return Promise.reject(error);
//   }
// );

// export default axiosInstance;



// import { createBrowserHistory } from 'history';
// const history = createBrowserHistory();

// // Usage in interceptor
// history.push('/login');
