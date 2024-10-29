// import React, { useState } from "react";
// import axios from "axios";
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// const PayPalPaymentForm = ({ formData, onSuccess, onError }) => {
//   const [isLoading, setIsLoading] = useState(false);

//   const handleSubmit = async (event) => {
//     event.preventDefault();
//     setIsLoading(true);

//     try {
//       // Step 1: Create customer
//       const createCustomerResponse = await axios.post("/create", formData);

//       if (createCustomerResponse.data.success) {
//         toast.success("Customer created successfully");

//         // Step 2: Capture payment
//         const capturePaymentResponse = await axios.post("/capture-payment", {
//           customerId: createCustomerResponse.data.customerId,
//           amount: formData.amount, // Ensure you have this in your formData
//         });

//         if (capturePaymentResponse.data.success) {
//           toast.success("Payment captured successfully");
//           onSuccess(capturePaymentResponse.data);
//         } else {
//           throw new Error("Payment capture failed");
//         }
//       } else {
//         throw new Error("Customer creation failed");
//       }
//     } catch (error) {
//       console.error("Payment process error:", error);
//       toast.error(
//         error.response?.data?.message ||
//           "An error occurred during the payment process"
//       );
//       onError(error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleCancel = async () => {
//     try {
//       const cancelResponse = await axios.post(`/${formData.bookingId}/cancel`);
//       if (cancelResponse.data.success) {
//         toast.info("Payment cancelled successfully");
//       } else {
//         throw new Error("Payment cancellation failed");
//       }
//     } catch (error) {
//       console.error("Cancellation error:", error);
//       toast.error(
//         error.response?.data?.message ||
//           "An error occurred while cancelling the payment"
//       );
//     }
//   };

//   return (
//     <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-xl">
//       <h2 className="text-2xl font-bold mb-6 text-center">PayPal Payment</h2>
//       <form onSubmit={handleSubmit} className="space-y-4">
//         {/* Add any additional form fields here if needed */}
//         <button
//           type="submit"
//           disabled={isLoading}
//           className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-50"
//         >
//           {isLoading ? "Processing..." : "Pay with PayPal"}
//         </button>
//       </form>
//       <button
//         onClick={handleCancel}
//         className="mt-4 w-full bg-gray-300 text-gray-800 py-2 px-4 rounded hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
//       >
//         Cancel Payment
//       </button>
//       <ToastContainer position="top-right" autoClose={5000} />
//     </div>
//   );
// };

// export default PayPalPaymentForm;
