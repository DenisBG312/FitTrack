import React from "react";
import { FaSearch, FaFilter } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const WorkoutFilters = ({
  searchTerm,
  setSearchTerm,
  showFilters,
  setShowFilters,
  filterDifficulty,
  setFilterDifficulty,
  filterMuscle,
  setFilterMuscle,
  difficultyOptions,
  muscleGroups,
  difficultyColors,
}) => {
  return (
    <motion.div
      className="mb-8 bg-gray-800 p-4 rounded-xl shadow-md"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.5 }}
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
        <div className="relative flex-grow md:mr-4">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search workouts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 transition duration-200"
          />
        </div>
        <motion.button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center justify-center px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition duration-200"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <FaFilter className="mr-2 text-yellow-400" />
          {showFilters ? "Hide Filters" : "Show Filters"}
        </motion.button>
      </div>

      <AnimatePresence>
        {showFilters && (
          <motion.div
            className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div>
              <label className="block text-gray-300 mb-2 font-medium">Difficulty Level</label>
              <div className="flex flex-wrap gap-2">
                <motion.button
                  onClick={() => setFilterDifficulty("")}
                  className={`px-3 py-1 rounded-full text-sm font-medium ${filterDifficulty === "" ? "bg-yellow-500 text-gray-900" : "bg-gray-700 text-gray-300"
                    }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  All
                </motion.button>
                {difficultyOptions.map(diff => (
                  <motion.button
                    key={diff}
                    onClick={() => setFilterDifficulty(diff)}
                    className={`px-3 py-1 rounded-full text-sm font-medium ${filterDifficulty === diff
                      ? `${difficultyColors[diff]} text-white`
                      : "bg-gray-700 text-gray-300"
                      }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {diff}
                  </motion.button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-gray-300 mb-2 font-medium">Target Muscle Group</label>
              <div className="flex flex-wrap gap-2">
                <motion.button
                  onClick={() => setFilterMuscle("")}
                  className={`px-3 py-1 rounded-full text-sm font-medium ${filterMuscle === "" ? "bg-yellow-500 text-gray-900" : "bg-gray-700 text-gray-300"
                    }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  All
                </motion.button>
                {muscleGroups.map(muscle => (
                  <motion.button
                    key={muscle}
                    onClick={() => setFilterMuscle(muscle)}
                    className={`px-3 py-1 rounded-full text-sm font-medium ${filterMuscle === muscle
                      ? "bg-purple-600 text-white"
                      : "bg-gray-700 text-gray-300"
                      }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {muscle}
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default WorkoutFilters;