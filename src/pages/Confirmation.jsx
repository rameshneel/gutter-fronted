import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const Confirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { booking } = location.state || {};

  if (!booking) {
    // Redirect to home if there's no booking data
    React.useEffect(() => {
      navigate("/");
    }, [navigate]);
    return null;
  }

  return (
    <div className="bg-gray-100 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-4 py-5 sm:p-6">
          <h1 className="text-3xl font-bold text-center text-gray-900 mb-8">
            Booking Confirmation
          </h1>
          <div className="space-y-6">
            <p className="text-lg text-center text-green-600 font-semibold">
              Your booking has been successfully confirmed!
            </p>
            <div className="border-t border-gray-200 pt-4">
              <h2 className="text-xl font-semibold mb-4">Booking Details</h2>
              <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Name</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {booking.customerName}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Email</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {booking.email}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Service</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {booking.selectService}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Date</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {new Date(booking.selectedDate).toLocaleDateString()}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Time</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {booking.selectedTimeSlot}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">
                    Payment Method
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {booking.paymentMethod}
                  </dd>
                </div>
              </dl>
            </div>
            <div className="mt-8">
              <button
                onClick={() => navigate("/")}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Return to Home
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Confirmation;
