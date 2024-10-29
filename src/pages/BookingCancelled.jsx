import React from "react";
import { useNavigate } from "react-router-dom";

const BookingCancelled = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-6 sm:p-10 rounded-lg shadow-md">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Booking Cancelled
          </h2>
          <div className="mt-4 text-center">
            <svg
              className="mx-auto h-12 w-12 text-red-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <p className="mt-4 text-center text-sm text-gray-600">
            Your booking has been cancelled successfully.
          </p>
        </div>
        <div className="mt-8 space-y-4">
          <button
            onClick={() => navigate("/book-service")}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Book Another Service
          </button>
          <button
            onClick={() => navigate("/")}
            className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Return to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingCancelled;
