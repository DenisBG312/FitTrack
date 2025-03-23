import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaDumbbell, FaUserCircle, FaRunning, FaClock, FaPlus, FaTimes, FaSearch, FaFilter, FaFire } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";

const Workouts = () => {
  const [workouts, setWorkouts] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [filterDifficulty, setFilterDifficulty] = useState("");
  const [filterMuscle, setFilterMuscle] = useState("");
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

  const filteredWorkouts = workouts.filter(workout => {
    const matchesSearch = searchTerm
      ? workout.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      workout.description.toLowerCase().includes(searchTerm.toLowerCase())
      : true;

    const matchesDifficulty = filterDifficulty
      ? workout.difficulty === filterDifficulty
      : true;

    const matchesMuscle = filterMuscle
      ? workout.targetMuscles.toLowerCase().includes(filterMuscle.toLowerCase())
      : true;

    return matchesSearch && matchesDifficulty && matchesMuscle;
  });

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
      scale: 1.05,
      boxShadow: "0 15px 30px rgba(0,0,0,0.3)",
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10
      }
    }
  };

  const headerIconVariants = {
    initial: { rotate: 0 },
    animate: {
      rotate: [0, 15, -15, 15, -15, 0],
      transition: { duration: 0.6 }
    }
  };

  const difficultyOptions = ["Beginner", "Intermediate", "Advanced"];
  const muscleGroups = ["Chest", "Back", "Legs", "Shoulders", "Arms", "Core", "Full Body"];

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white py-12 px-4 sm:px-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="container mx-auto"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div className="flex items-center mb-4 md:mb-0">
            <motion.div
              initial="initial"
              whileHover="animate"
              variants={headerIconVariants}
            >
              <FaDumbbell className="text-yellow-400 text-4xl md:text-5xl mr-4" />
            </motion.div>
            <motion.h1
              className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              Community Workouts
            </motion.h1>
          </div>
          <motion.button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center bg-gradient-to-r from-yellow-500 to-yellow-600 text-gray-900 px-6 py-3 rounded-lg font-bold shadow-lg hover:shadow-xl"
            whileHover={{
              scale: 1.05,
              backgroundColor: "#fbbf24",
              boxShadow: "0 0 20px rgba(251, 191, 36, 0.5)"
            }}
            whileTap={{ scale: 0.95 }}
          >
            <FaPlus className="mr-2" />
            Add Workout
          </motion.button>
        </div>

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


        {isLoading && (
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
        )}

        <AnimatePresence>
          {error && (
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
          )}
        </AnimatePresence>

        {!isLoading && filteredWorkouts.length === 0 && (
          <motion.div
            className="text-center p-8 bg-gray-800 rounded-xl max-w-lg mx-auto shadow-md border border-gray-700"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            {searchTerm || filterDifficulty || filterMuscle ? (
              <div>
                <FaSearch className="text-yellow-400 text-4xl mx-auto mb-4 opacity-60" />
                <p className="text-gray-300 text-xl mb-2">No matching workouts found</p>
                <p className="text-gray-400">Try adjusting your filters or search terms</p>
                <motion.button
                  onClick={() => {
                    setSearchTerm("");
                    setFilterDifficulty("");
                    setFilterMuscle("");
                  }}
                  className="mt-4 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm font-medium"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Clear filters
                </motion.button>
              </div>
            ) : (
              <div>
                <FaDumbbell className="text-yellow-400 text-4xl mx-auto mb-4 opacity-60" />
                <p className="text-gray-300 text-xl mb-2">No workouts available yet</p>
                <p className="text-gray-400">Be the first to add one!</p>
                <motion.button
                  onClick={() => setIsModalOpen(true)}
                  className="mt-4 px-4 py-2 bg-yellow-500 text-gray-900 rounded-lg font-medium"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Add a workout
                </motion.button>
              </div>
            )}
          </motion.div>
        )}

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {filteredWorkouts.map((workout) => (
            <motion.div
              key={workout.id}
              className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl overflow-hidden shadow-lg border border-gray-700"
              variants={cardVariants}
              whileHover="hover"
            >
              <Link to={`/workouts/${workout.id}`} className="block h-full">
                <div className="p-6 flex flex-col h-full">
                  <div className="flex justify-between items-center mb-4">
                    <motion.span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${difficultyColors[workout.difficulty] || "bg-blue-500"} text-white`}
                      whileHover={{ scale: 1.1 }}
                    >
                      {workout.difficulty}
                    </motion.span>

                    <motion.div
                      className="flex items-center"
                      whileHover={{ scale: 1.1 }}
                    >
                      <FaClock className="text-yellow-400 mr-1" />
                      <span className="text-sm">{workout.duration} mins</span>
                    </motion.div>
                  </div>

                  <div className="group mb-2">
                    <h2 className="text-2xl font-bold text-yellow-400 group-hover:text-yellow-300 transition duration-300">
                      {workout.title}
                    </h2>
                    <motion.div
                      className="h-0.5 bg-yellow-500 mt-1 w-0 group-hover:w-full transition-all duration-300"
                    />
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
                      <div className="text-xs text-gray-500">
                        {formatDate(workout.createdAt)}
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