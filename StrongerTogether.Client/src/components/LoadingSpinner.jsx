import React from "react";
import { FaDumbbell } from "react-icons/fa";
import { motion } from "framer-motion";

const LoadingSpinner = () => {
  return (
    <div className="flex justify-center items-center h-64">
      <motion.div
        animate={{
          rotate: 360,
          scale: [1, 1.2, 1]
        }}
        transition={{
          rotate: { repeat: Infinity, duration: 1.5, ease: "linear" },
          scale: { repeat: Infinity, duration: 1, ease: "easeInOut" }
        }}
        className="relative"
      >
        <FaDumbbell className="text-yellow-400 text-6xl" />
        <motion.div
          className="absolute inset-0 rounded-full"
          animate={{
            boxShadow: ["0 0 0px rgba(250, 204, 21, 0)", "0 0 20px rgba(250, 204, 21, 0.5)", "0 0 0px rgba(250, 204, 21, 0)"]
          }}
          transition={{
            repeat: Infinity,
            duration: 2
          }}
        />
      </motion.div>
    </div>
  );
};

export default LoadingSpinner;