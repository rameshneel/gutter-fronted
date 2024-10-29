import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { XMarkIcon } from '@heroicons/react/24/outline';

const TermsAndConditions = ({ isOpen, onClose }) => {
  // Use effect to manage body scroll
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('no-scroll');
    } else {
      document.body.classList.remove('no-scroll');
    }

    // Cleanup function to ensure no-scroll class is removed on component unmount
    return () => {
      document.body.classList.remove('no-scroll');
    };
  }, [isOpen]);

  if (!isOpen) return null; // If not open, render nothing

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: isOpen ? 1 : 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50"
      role="dialog"
      aria-labelledby="terms-title"
      aria-modal="true"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="relative max-w-lg mx-auto p-6 bg-white border border-gray-200 rounded-lg shadow-lg overflow-auto max-h-screen"
      >
        <button
          onClick={onClose}
          aria-label="Close Terms and Conditions"
          className="absolute top-4 right-4 p-1 text-gray-500 hover:text-gray-700 focus:outline-none"
        >
          <XMarkIcon className="w-6 h-6" />
        </button>
        <h2 id="terms-title" className="text-2xl font-semibold mb-6">
          Terms and Conditions
        </h2>
        <div className="max-h-96 overflow-y-auto mb-6">
          <p className="text-gray-700 mb-4">
            By continuing, you confirm that the details you have provided about your property are accurate and that you have selected the correct size. Incorrect details may lead to the cancellation of your job with no refund.
          </p>
          <p className="text-gray-700 mb-6">
            Refunds are available for cancellations made at least 48 hours prior to your booking date. Cancellations within 48 hours will result in a rescheduling of the work. No refunds or rescheduling will be offered for same-day cancellations.
          </p>
        </div>
        <div className="flex justify-end">
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default TermsAndConditions;

