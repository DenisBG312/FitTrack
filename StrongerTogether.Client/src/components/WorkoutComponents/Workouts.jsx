import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaDumbbell, FaPlus, FaSearch } from "react-icons/fa";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import WorkoutCard from "./WorkoutCard";
import WorkoutFilters from "./WorkoutFilters";
import AddWorkoutModal from "./AddWorkoutModal";
import EditWorkoutModal from "./EditWorkoutModal";
import LoadingSpinner from "../LoadingSpinner";
import ErrorAlert from "../ErrorAlert";

const Workouts = () => {
  const API_URL = import.meta.env.VITE_PUBLIC_API_URL;
  const [workouts, setWorkouts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(6);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [userId, setUserId] = useState(null);
  const [userRole, setUserRole] = useState('');
  const [editedWorkout, setEditedWorkout] = useState({
    id: "",
    title: "",
    description: "",
    duration: 0,
    difficulty: "Beginner",
    targetMuscles: "",
    videoUrl: "",
  });
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
    videoUrl: "",
  });

  useEffect(() => {
    if (isModalOpen || isEditModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isModalOpen, isEditModalOpen]);

  const fetchWorkouts = async (page = 1) => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${API_URL}/Workout?page=${page}&pageSize=${pageSize}`);
      setWorkouts(response.data);
      const totalPagesHeader = response.headers["x-pagination-totalpages"];
      if (totalPagesHeader) {
        setTotalPages(parseInt(totalPagesHeader));
      }
    } catch (error) {
      console.error("Error fetching workouts:", error);
      setError("Failed to load workouts. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const response = await axios.get(`${API_URL}/auth/profile`, {
          withCredentials: true,
        });
        setUserId(response.data.id);
        setUserRole(response.data.role);
      } catch (error) {
        console.error("Error fetching user ID:", error);
      }
    };

    fetchUserId();
  }, []);

  useEffect(() => {
    fetchWorkouts(currentPage);
  }, [currentPage]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewWorkout({
      ...newWorkout,
      [name]: value,
    });
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditedWorkout({
      ...editedWorkout,
      [name]: value,
    });
  };

  const handleAddWorkout = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/Workout`, newWorkout, {
        withCredentials: true,
      });
      await fetchWorkouts(currentPage
      );

      setIsModalOpen(false);
      setNewWorkout({
        title: "",
        description: "",
        duration: 0,
        difficulty: "Beginner",
        targetMuscles: "",
        videoUrl: "",
      });
    } catch (error) {
      console.error("Error adding workout:", error);
      setError("Failed to add workout. Please try again.");
    }
  };

  const handleUpdateWorkout = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `${API_URL}/Workout/${editedWorkout.id}`,
        editedWorkout,
        { withCredentials: true }
      );

      setWorkouts((prevWorkouts) =>
        prevWorkouts.map((workout) =>
          workout.id === editedWorkout.id ? editedWorkout : workout
        )
      );

      setIsEditModalOpen(false);
    } catch (error) {
      console.error("Error updating workout:", error);
      setError("Failed to update workout. Please try again.");
    }
  };

  const handleDeleteWorkout = async (e, workoutId) => {
    e.preventDefault();
    e.stopPropagation();

    if (window.confirm("Are you sure you want to delete this workout?")) {
      try {
        await axios.delete(`${API_URL}/Workout/${workoutId}`, {
          withCredentials: true,
        });
        await fetchWorkouts(currentPage);
      } catch (error) {
        console.error("Error deleting workout:", error);
        setError("Failed to delete workout. Please try again.");
      }
    }
  };

  const handleEditWorkout = (workout) => {
    setEditedWorkout(workout);
    setIsEditModalOpen(true);
  };

  const difficultyColors = {
    Beginner: "bg-green-500",
    Intermediate: "bg-yellow-500",
    Advanced: "bg-red-500",
  };

  const filteredWorkouts = workouts.filter((workout) => {
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
        staggerChildren: 0.1,
      },
    },
  };

  const headerIconVariants = {
    initial: { rotate: 0 },
    animate: {
      rotate: [0, 15, -15, 15, -15, 0],
      transition: { duration: 0.6 },
    },
  };

  const difficultyOptions = ["Beginner", "Intermediate", "Advanced"];
  const muscleGroups = ["Chest", "Back", "Legs", "Shoulders", "Arms", "Core", "Full Body"];

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
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
          {(userRole == 'Admin' || userRole == 'Coach') && (
            <motion.button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center bg-gradient-to-r from-yellow-500 to-yellow-600 text-gray-900 px-6 py-3 rounded-lg font-bold shadow-lg hover:shadow-xl"
              whileHover={{
                scale: 1.05,
                backgroundColor: "#fbbf24",
                boxShadow: "0 0 20px rgba(251, 191, 36, 0.5)",
              }}
              whileTap={{ scale: 0.95 }}
            >
              <FaPlus className="mr-2" />
              Add Workout
            </motion.button>
          )}
        </div>

        <WorkoutFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          showFilters={showFilters}
          setShowFilters={setShowFilters}
          filterDifficulty={filterDifficulty}
          setFilterDifficulty={setFilterDifficulty}
          filterMuscle={filterMuscle}
          setFilterMuscle={setFilterMuscle}
          difficultyOptions={difficultyOptions}
          muscleGroups={muscleGroups}
          difficultyColors={difficultyColors}
        />

        <AddWorkoutModal
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          newWorkout={newWorkout}
          handleInputChange={handleInputChange}
          handleAddWorkout={handleAddWorkout}
        />

        <EditWorkoutModal
          isEditModalOpen={isEditModalOpen}
          setIsEditModalOpen={setIsEditModalOpen}
          editedWorkout={editedWorkout}
          setEditedWorkout={setEditedWorkout}
          handleEditInputChange={handleEditInputChange}
          handleUpdateWorkout={handleUpdateWorkout}
        />

        {isLoading && <LoadingSpinner />}

        {error && <ErrorAlert error={error} />}

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
            <WorkoutCard
              key={workout.id}
              workout={workout}
              userId={userId}
              handleDeleteWorkout={handleDeleteWorkout}
              handleEditWorkout={handleEditWorkout}
              difficultyColors={difficultyColors}
              formatDate={formatDate}
            />
          ))}
        </motion.div>
        {!isLoading && totalPages > 1 && (
          <motion.div
            className="flex justify-center items-center mt-10 space-x-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <motion.button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={`px-5 py-3 rounded-lg font-medium flex items-center ${currentPage === 1
                  ? "bg-gray-800 text-gray-500 cursor-not-allowed"
                  : "bg-gray-800 hover:bg-gray-700 text-white border border-gray-700 hover:border-yellow-500"
                }`}
              whileHover={{ scale: currentPage === 1 ? 1 : 1.05 }}
              whileTap={{ scale: currentPage === 1 ? 1 : 0.95 }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Previous
            </motion.button>

            <div className="flex items-center space-x-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <motion.button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-10 h-10 rounded-lg font-bold flex items-center justify-center ${currentPage === page
                      ? "bg-gradient-to-r from-yellow-500 to-yellow-600 text-gray-900"
                      : "bg-gray-800 hover:bg-gray-700 text-white"
                    }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {page}
                </motion.button>
              ))}
            </div>

            <motion.button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className={`px-5 py-3 rounded-lg font-medium flex items-center ${currentPage === totalPages
                  ? "bg-gray-800 text-gray-500 cursor-not-allowed"
                  : "bg-gray-800 hover:bg-gray-700 text-white border border-gray-700 hover:border-yellow-500"
                }`}
              whileHover={{ scale: currentPage === totalPages ? 1 : 1.05 }}
              whileTap={{ scale: currentPage === totalPages ? 1 : 0.95 }}
            >
              Next
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </motion.button>
          </motion.div>
        )}
      </motion.div>

    </div>
  );
};

export default Workouts;