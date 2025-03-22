import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaDumbbell, FaUserCircle, FaRunning, FaClock, FaPlus } from "react-icons/fa";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const Workouts = () => {
  const [workouts, setWorkouts] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newWorkout, setNewWorkout] = useState({
    title: "",
    description: "",
    duration: 0,
    difficulty: "Beginner",
    targetMuscles: "",
    videoUrl: ""
  });

  const fetchWorkouts = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get("https://localhost:7039/api/Workout");
      setWorkouts(response.data);
    } catch (error) {
      console.error("Error fetching workouts:", error);
      setError("Failed to load workouts. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkouts();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewWorkout({
      ...newWorkout,
      [name]: value
    });
  };

  const handleAddWorkout = async (e) => {
    e.preventDefault();
    try {
      await axios.post("https://localhost:7039/api/Workout", newWorkout, {
        withCredentials: true
      });
      await fetchWorkouts();
  
      setIsModalOpen(false);
      setNewWorkout({
        title: "",
        description: "",
        duration: 0,
        difficulty: "Beginner",
        targetMuscles: "",
        videoUrl: ""
      });
    } catch (error) {
      console.error("Error adding workout:", error);
      setError("Failed to add workout. Please try again.");
    }
  };

  const difficultyColors = {
    Beginner: "bg-green-500",
    Intermediate: "bg-yellow-500",
    Advanced: "bg-red-500"
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const cardVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    },
    hover: {
      scale: 1.03,
      boxShadow: "0 10px 20px rgba(0,0,0,0.2)",
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white py-12 px-4 sm:px-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="container mx-auto"
      >
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center">
            <FaDumbbell className="text-yellow-400 text-4xl mr-4" />
            <motion.h1
              className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              Community Workouts
            </motion.h1>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center bg-yellow-500 text-gray-900 px-6 py-3 rounded-lg hover:bg-yellow-600 transition duration-300"
          >
            <FaPlus className="mr-2" />
            Add Workout
          </button>
        </div>

        {/* Modal for adding a new workout */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-gray-800 p-8 rounded-lg w-full max-w-md">
              <h2 className="text-2xl font-bold text-yellow-400 mb-6">Add a New Workout</h2>
              <form onSubmit={handleAddWorkout}>
                <div className="mb-4">
                  <label className="block text-gray-300 mb-2">Title</label>
                  <input
                    type="text"
                    name="title"
                    value={newWorkout.title}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-300 mb-2">Description</label>
                  <textarea
                    name="description"
                    value={newWorkout.description}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-300 mb-2">Duration (mins)</label>
                  <input
                    type="number"
                    name="duration"
                    value={newWorkout.duration}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-300 mb-2">Difficulty</label>
                  <select
                    name="difficulty"
                    value={newWorkout.difficulty}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg"
                    required
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>
                <div className="mb-4">
                  <label className="block text-gray-300 mb-2">Target Muscles</label>
                  <input
                    type="text"
                    name="targetMuscles"
                    value={newWorkout.targetMuscles}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg"
                    required
                  />
                </div>
                <div className="mb-6">
                  <label className="block text-gray-300 mb-2">Video URL</label>
                  <input
                    type="url"
                    name="videoUrl"
                    value={newWorkout.videoUrl}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg"
                  />
                </div>
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="mr-4 px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-yellow-500 text-gray-900 rounded-lg hover:bg-yellow-600"
                  >
                    Add Workout
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Rest of the component remains the same */}
        {isLoading && (
          <div className="flex justify-center items-center h-64">
            <motion.div
              animate={{
                rotate: 360,
                scale: [1, 1.2, 1]
              }}
              transition={{
                rotate: { repeat: Infinity, duration: 2, ease: "linear" },
                scale: { repeat: Infinity, duration: 1, ease: "easeInOut" }
              }}
            >
              <FaDumbbell className="text-yellow-400 text-5xl" />
            </motion.div>
          </div>
        )}

        {error && (
          <motion.div
            className="bg-red-600 text-white p-6 rounded-lg mb-8 max-w-md mx-auto"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <p className="text-center font-semibold">{error}</p>
          </motion.div>
        )}

        {!isLoading && workouts.length === 0 && (
          <motion.div
            className="text-center p-8 bg-gray-800 rounded-lg max-w-lg mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <p className="text-gray-300 text-xl">No workouts available yet. Be the first to add one!</p>
          </motion.div>
        )}

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {workouts.map((workout) => (
            <motion.div
              key={workout.id}
              className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl overflow-hidden shadow-lg"
              variants={cardVariants}
              whileHover="hover"
            >
              <Link to={`/workouts/${workout.id}`}>
                <div className="p-6">
                  <h2 className="text-2xl font-bold text-yellow-400 mb-2">
                    {workout.title}
                  </h2>

                  <p className="text-gray-300 mb-4">{workout.description}</p>

                  <div className="flex flex-wrap gap-3 mb-4">
                    <motion.span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${difficultyColors[workout.difficulty] || "bg-blue-500"} text-white`}
                      whileHover={{ scale: 1.1 }}
                    >
                      {workout.difficulty}
                    </motion.span>

                    <motion.span
                      className="px-3 py-1 rounded-full text-xs font-medium bg-purple-600 text-white"
                      whileHover={{ scale: 1.1 }}
                    >
                      {workout.targetMuscles}
                    </motion.span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center">
                      <FaClock className="text-yellow-400 mr-2" />
                      <span>{workout.duration} mins</span>
                    </div>

                    <div className="flex items-center">
                      <FaRunning className="text-yellow-400 mr-2" />
                      <span>{workout.targetMuscles}</span>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-700 mt-2">
                    <div className="flex items-center">
                      <motion.div
                        className="h-8 w-8 rounded-full overflow-hidden mr-3 bg-gray-700"
                        whileHover={{ scale: 1.1 }}
                      >
                        {workout.user?.profileImageUrl ? (
                          <img
                            src={workout.user.profileImageUrl}
                            alt={workout.user.username}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <FaUserCircle className="h-full w-full text-gray-500" />
                        )}
                      </motion.div>
                      <div>
                        <p className="text-sm text-yellow-400">{workout.user?.username || "Unknown User"}</p>
                        <p className="text-xs text-gray-400">
                          {new Date(workout.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Workouts;