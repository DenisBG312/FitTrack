import React from "react";
import { FaPlus, FaTimes } from "react-icons/fa";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { AnimatePresence } from "framer-motion";
import { useEffect } from "react";

const AddWorkoutModal = ({
  isModalOpen,
  setIsModalOpen,
  newWorkout,
  handleInputChange,
  handleAddWorkout,
}) => {

  useEffect(() => {
    if (isModalOpen) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }

    return () => document.body.classList.remove("overflow-hidden");
  }, [isModalOpen]);

  return (
    <AnimatePresence>
      {isModalOpen && (
        <motion.div
          className="fixed inset-0 flex justify-center items-center z-50 p-4 backdrop-blur-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-gray-900 bg-opacity-90 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden border border-gray-700"
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            onClick={e => e.stopPropagation()}
            style={{
              maxHeight: '100vh',
            }}
          >
            <div className="bg-gradient-to-r from-yellow-600 to-yellow-400 bg-opacity-90 backdrop-filter backdrop-blur-sm p-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">
                  Create New Workout
                </h2>
                <motion.button
                  onClick={() => setIsModalOpen(false)}
                  className="bg-gray-900 bg-opacity-20 rounded-full p-2 hover:bg-opacity-30"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <FaTimes size={18} />
                </motion.button>
              </div>
            </div>

            <div className="p-6 bg-gray-900 bg-opacity-80 overflow-auto" style={{ maxHeight: '60vh' }}>
              <form onSubmit={handleAddWorkout} className="space-y-5">
                <div>
                  <label className="block text-yellow-400 mb-2 font-medium">Workout Title</label>
                  <input
                    type="text"
                    name="title"
                    value={newWorkout.title}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-800 bg-opacity-80 text-white rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition duration-200"
                    placeholder="Benchpress, Dumbbell press, etc."
                    required
                  />
                </div>

                <div>
                  <label className="block text-yellow-400 mb-2 font-medium">Description</label>
                  <textarea
                    name="description"
                    value={newWorkout.description}
                    onChange={handleInputChange}
                    placeholder="Describe the workout routine, exercises, and goals..."
                    className="w-full px-4 py-3 bg-gray-800 bg-opacity-80 text-white rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition duration-200 min-h-32"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-yellow-400 mb-2 font-medium">Duration (mins)</label>
                    <input
                      type="number"
                      name="duration"
                      value={newWorkout.duration}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gray-800 bg-opacity-80 text-white rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition duration-200"
                      required
                      min="1"
                    />
                  </div>

                  <div>
                    <label className="block text-yellow-400 mb-2 font-medium">Difficulty</label>
                    <select
                      name="difficulty"
                      value={newWorkout.difficulty}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gray-800 bg-opacity-80 text-white rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition duration-200 appearance-none"
                      required
                      style={{
                        backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%23FBBF24' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E\")",
                        backgroundPosition: "right 1rem center",
                        backgroundRepeat: "no-repeat",
                        backgroundSize: "1.5em 1.5em",
                        paddingRight: "3rem"
                      }}
                    >
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-yellow-400 mb-2 font-medium">Target Muscles</label>
                  <input
                    type="text"
                    name="targetMuscles"
                    value={newWorkout.targetMuscles}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-800 bg-opacity-80 text-white rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition duration-200"
                    placeholder="Legs, Back, Core, Full Body, etc."
                    required
                  />
                </div>

                <div>
                  <label className="block text-yellow-400 mb-2 font-medium">Video URL</label>
                  <input
                    type="url"
                    name="videoUrl"
                    value={newWorkout.videoUrl}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-800 bg-opacity-80 text-white rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition duration-200"
                    placeholder="https://www.youtube.com/watch?v=example"
                  />
                </div>

                <div className="pt-4 border-t border-gray-700 flex space-x-4 justify-end">
                  <motion.button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-6 py-3 bg-gray-800 bg-opacity-70 text-gray-300 rounded-lg hover:bg-opacity-100 transition-all duration-200"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    type="submit"
                    className="px-6 py-3 bg-gradient-to-r from-yellow-500 to-yellow-400 text-gray-900 font-bold rounded-lg shadow-md flex items-center"
                    whileHover={{
                      scale: 1.02,
                      boxShadow: "0 0 15px rgba(251, 191, 36, 0.5)"
                    }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <FaPlus className="mr-2" />
                    Create Workout
                  </motion.button>
                </div>
              </form>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AddWorkoutModal;