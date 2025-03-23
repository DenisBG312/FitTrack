import React from "react";
import { FaClock, FaFire, FaUserCircle, FaTrash, FaEdit } from "react-icons/fa";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const WorkoutCard = ({
  workout,
  handleDeleteWorkout,
  handleEditWorkout,
  difficultyColors,
  formatDate,
}) => {
  return (
    <motion.div
      className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl overflow-hidden shadow-lg border border-gray-700"
      whileHover={{ scale: 1.05, boxShadow: "0 15px 30px rgba(0,0,0,0.3)" }}
    >
      <div className="p-6 flex flex-col h-full">
        <div className="flex justify-between items-center mb-4">
          <motion.span
            className={`px-3 py-1 rounded-full text-xs font-medium ${
              difficultyColors[workout.difficulty] || "bg-blue-500"
            } text-white`}
            whileHover={{ scale: 1.1 }}
          >
            {workout.difficulty}
          </motion.span>

          <motion.div className="flex items-center" whileHover={{ scale: 1.1 }}>
            <FaClock className="text-yellow-400 mr-1" />
            <span className="text-sm">{workout.duration} mins</span>
          </motion.div>
        </div>

        <div className="group mb-2">
          <h2 className="text-2xl font-bold text-yellow-400 group-hover:text-yellow-300 transition duration-300">
            {workout.title}
          </h2>
          <motion.div className="h-0.5 bg-yellow-500 mt-1 w-0 group-hover:w-full transition-all duration-300" />
        </div>

        <div className="flex items-center text-sm text-gray-400 mb-4">
          <FaFire className="text-yellow-500 mr-2" />
          <span>{workout.targetMuscles}</span>
        </div>

        <div className="mt-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              {workout.user?.profileImageUrl ? (
                <img
                  src={workout.user.profileImageUrl}
                  alt={`${workout.user.username}'s profile`}
                  className="w-6 h-6 rounded-full mr-2 object-cover border border-gray-700"
                />
              ) : (
                <FaUserCircle className="text-gray-400 mr-2 w-6 h-6" />
              )}
              <span className="text-sm text-gray-400">
                {workout.user?.username || "Anonymous"}
              </span>
            </div>
            <div className="flex items-center">
              <div className="text-xs text-gray-500 mr-3">
                {formatDate(workout.createdAt)}
              </div>
              <motion.button
                onClick={() => handleEditWorkout(workout)}
                className="text-gray-400 hover:text-yellow-500 transition-colors duration-200 mr-2"
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
              >
                <FaEdit size={14} />
              </motion.button>
              <motion.button
                onClick={(e) => handleDeleteWorkout(e, workout.id)}
                className="text-gray-400 hover:text-red-500 transition-colors duration-200"
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
              >
                <FaTrash size={14} />
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default WorkoutCard;