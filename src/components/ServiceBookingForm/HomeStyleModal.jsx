import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const HomeStyleModal = ({ isOpen, onClose }) => {
  const homeStyleImages = {
    "Terrace":  "https://thumbs.dreamstime.com/b/types-houses-set-retro-styled-blue-background-42263677.jpg",
    // "Semi-Detached":  "https://thumbs.dreamstime.com/b/types-houses-set-retro-styled-blue-background-42263677.jpg",
    // "Detached":  "https://thumbs.dreamstime.com/b/types-houses-set-retro-styled-blue-background-42263677.jpg",
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-lg shadow-xl max-w-3xl w-full overflow-hidden"
          >
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-4"></h2>
              <div className="grid grid-cols-1">
                {Object.entries(homeStyleImages).map(([style, imageSrc]) => (
                  <div key={style} className="text-center">
                    <img src={imageSrc} alt={style} className="w-full h-48 object-cover rounded-lg mb-2" />
                    {/* <p className="font-medium">{style}</p> */}
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-gray-100 px-6 py-4 flex justify-end">
              <button
                onClick={onClose}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Close
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default HomeStyleModal;