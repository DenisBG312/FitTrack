import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { 
  FaDumbbell, 
  FaUserCircle, 
  FaClock, 
  FaArrowLeft,
  FaCalendarAlt
} from "react-icons/fa";
import { motion } from "framer-motion";

const WorkoutDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [workout, setWorkout] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const videoRef = useRef(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  useEffect(() => {
    const fetchWorkout = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`https://localhost:7039/api/Workout/GetSpecificWorkout/${id}`);
        setWorkout(response.data);
      } catch (error) {
        console.error("Error fetching workout:", error);
        setError("Failed to load workout. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchWorkout();
  }, [id]);

  const difficultyBadges = {
    Beginner: "bg-green-500",
    Intermediate: "bg-yellow-500",
    Advanced: "bg-red-500"
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <FaDumbbell className="text-yellow-500 text-5xl mx-auto animate-pulse" />
          <p className="mt-4 text-xl">Loading workout...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="bg-red-600 p-6 rounded-lg max-w-md mx-auto text-center">
          <p className="text-xl">{error}</p>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 px-6 py-2 bg-white text-red-600 font-semibold rounded-lg hover:bg-gray-100"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!workout) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center p-8 bg-gray-800 rounded-lg max-w-lg">
          <p className="text-2xl mb-4">Workout not found</p>
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-2 bg-yellow-500 text-black rounded-lg"
          >
            Back to Workouts
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="bg-gray-800 py-4 px-4 sm:px-6 shadow-md">
        <div className="container mx-auto max-w-6xl flex items-center">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-yellow-400 hover:text-yellow-300"
          >
            <FaArrowLeft className="mr-2" />
            Back
          </button>
          <h1 className="text-2xl font-bold text-center flex-1">{workout.title}</h1>
          <div className="w-16"></div>
        </div>
      </div>

      <div className="container mx-auto max-w-6xl py-6 px-4 sm:px-6">
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div className="lg:col-span-2" variants={itemVariants}>
            <div className="bg-black rounded-lg overflow-hidden relative">
              <video
                ref={videoRef}
                src={workout.videoUrl}
                className="w-full h-auto"
                controls
                poster="/poster-image.jpg"
                preload="metadata"
                autoPlay
                loop
              />
            </div>

            <div className="mt-6 bg-gray-800 rounded-lg p-6 shadow-lg">
              <div className="flex flex-wrap gap-2 mb-6">
                <span className={`px-4 py-2 rounded-lg ${difficultyBadges[workout.difficulty] || "bg-gray-600"} font-semibold text-white`}>
                  {workout.difficulty}
                </span>
                <span className="px-4 py-2 rounded-lg bg-purple-600 font-semibold">
                  {workout.targetMuscles}
                </span>
                <span className="px-4 py-2 rounded-lg bg-blue-600 font-semibold flex items-center">
                  <FaClock className="mr-2" />
                  {workout.duration} minutes
                </span>
              </div>

              <h2 className="text-xl font-bold mb-4 text-yellow-400">Description</h2>
              <p className="text-gray-200 text-lg">{workout.description}</p>
            </div>
          </motion.div>

          <motion.div variants={itemVariants}>
            <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
              <h2 className="text-xl font-bold mb-6 text-yellow-400">Workout Creator</h2>
              
              <div className="flex items-start">
                <div className="w-16 h-16 rounded-full overflow-hidden mr-4 bg-gray-700 flex-shrink-0 border-2 border-yellow-400">
                  {workout.user?.profileImageUrl ? (
                    <img 
                      src={workout.user.profileImageUrl}
                      alt={workout.user.username}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <FaUserCircle className="h-full w-full text-gray-500" />
                  )}
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-white">
                    {workout.user?.username || "Unknown User"}
                  </h3>
                  <p className="text-gray-400 flex items-center mt-1">
                    <FaCalendarAlt className="mr-2" />
                    {new Date(workout.createdAt).toLocaleDateString()}
                  </p>
                  
                  <div className="mt-4 grid grid-cols-2 gap-4">
                    <div className="bg-gray-700 p-3 rounded-lg">
                      <span className="block text-sm text-gray-400">Height</span>
                      <span className="text-lg font-semibold">{workout.user?.height || "-"} cm</span>
                    </div>
                    <div className="bg-gray-700 p-3 rounded-lg">
                      <span className="block text-sm text-gray-400">Weight</span>
                      <span className="text-lg font-semibold">{workout.user?.weight || "-"} kg</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 pt-6 border-t border-gray-700">
                <h3 className="text-lg font-semibold mb-2 text-yellow-400">Workout Stats</h3>
                <div className="grid grid-cols-1 gap-3">
                  <div className="bg-gray-700 p-3 rounded-lg flex justify-between items-center">
                    <span className="text-gray-300">Created</span>
                    <span className="font-medium">
                      {new Date(workout.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                  <div className="bg-gray-700 p-3 rounded-lg flex justify-between items-center">
                    <span className="text-gray-300">Difficulty</span>
                    <span className={`font-medium px-2 py-1 rounded ${difficultyBadges[workout.difficulty] || "bg-gray-600"}`}>
                      {workout.difficulty}
                    </span>
                  </div>
                  <div className="bg-gray-700 p-3 rounded-lg flex justify-between items-center">
                    <span className="text-gray-300">Duration</span>
                    <span className="font-medium">{workout.duration} minutes</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default WorkoutDetails;