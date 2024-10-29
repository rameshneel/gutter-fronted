import React, { useState } from "react";
import { capturePayment, cancelPayment } from "../../services/api";
import { toast } from "react-toastify";

const PayPalPaymentForm = ({ formData }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handlePayment = async () => {
    setIsLoading(true);
    try {
      const response = await capturePayment({
        customerId: formData.customerId,
        amount: formData.amount, // Ensure you have this in your formData
      });
      if (response.success) {
        toast.success("Payment captured successfully");
        // Handle successful payment (e.g., redirect to confirmation page)
      } else {
        throw new Error("Payment capture failed");
      }
    } catch (error) {
      console.error("Payment process error:", error);
      toast.error(
        error.response?.data?.message ||
          "An error occurred during the payment process"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = async () => {
    try {
      const response = await cancelPayment(formData.bookingId);
      if (response.success) {
        toast.info("Payment cancelled successfully");
        // Handle cancellation (e.g., reset form or redirect)
      } else {
        throw new Error("Payment cancellation failed");
      }
    } catch (error) {
      console.error("Cancellation error:", error);
      toast.error(
        error.response?.data?.message ||
          "An error occurred while cancelling the payment"
      );
    }
  };

  return (
    <div className="mt-4">
      <button
        onClick={handlePayment}
        disabled={isLoading}
        className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-50"
      >
        {isLoading ? "Processing..." : "Pay with PayPal"}
      </button>
      <button
        onClick={handleCancel}
        className="mt-2 w-full bg-gray-300 text-gray-800 py-2 px-4 rounded hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
      >
        Cancel Payment
      </button>
    </div>
  );
};

export default PayPalPaymentForm;
