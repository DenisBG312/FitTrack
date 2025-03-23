import React from "react";
import { FaTimes } from "react-icons/fa";
import { motion } from "framer-motion";

const ErrorAlert = ({ error }) => {
  return (
    <motion.div
      className="bg-gradient-to-r from-red-600 to-red-700 text-white p-6 rounded-lg mb-8 max-w-md mx-auto shadow-lg"
      initial={{ opacity: 0, scale: 0.9, y: -20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: -20 }}
      transition={{ type: "spring", stiffness: 500, damping: 30 }}
    >
      <div className="flex items-center">
        <FaTimes className="text-2xl mr-4" />
        <p className="font-semibold">{error}</p>
      </div>
    </motion.div>
  );
};

export default ErrorAlert;