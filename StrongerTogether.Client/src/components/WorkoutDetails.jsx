import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaDumbbell, FaUserCircle, FaClock, FaArrowLeft } from "react-icons/fa";
import { motion } from "framer-motion";

const WorkoutDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [workout, setWorkout] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

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

  const difficultyColors = {
    Beginner: "bg-green-500",
    Intermediate: "bg-yellow-500",
    Advanced: "bg-red-500"
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
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
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <motion.div 
          className="bg-red-600 text-white p-6 rounded-lg max-w-md mx-auto"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <p className="text-center font-semibold">{error}</p>
        </motion.div>
      </div>
    );
  }

  if (!workout) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center p-8 bg-gray-800 rounded-lg max-w-lg">
          <p className="text-gray-300 text-xl">Workout not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white py-12 px-4 sm:px-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="container mx-auto max-w-4xl"
      >
        <button
          onClick={() => navigate(-1)}
          className="mb-8 flex items-center text-yellow-400 hover:text-yellow-300 transition-colors"
        >
          <FaArrowLeft className="mr-2" />
          Back to Workouts
        </button>

        <motion.div
          className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl overflow-hidden shadow-lg"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="p-6">
          <video
          src={workout.videoUrl}
          className="w-full h-full"
          title={`${workout.title} video`}
          loop
          controls
          autoPlay
          muted
        />

            <h1 className="text-3xl font-bold text-yellow-400 mb-4">
              {workout.title}
            </h1>

            <div className="flex flex-wrap gap-3 mb-6">
              <span className={`px-4 py-2 rounded-full ${difficultyColors[workout.difficulty]}`}>
                {workout.difficulty}
              </span>
              <span className="px-4 py-2 rounded-full bg-purple-600">
                {workout.targetMuscles}
              </span>
              <span className="px-4 py-2 rounded-full bg-blue-600">
                <FaClock className="inline mr-2" />
                {workout.duration} minutes
              </span>
            </div>

            <div className="prose prose-invert max-w-none mb-8">
              <p className="text-lg">{workout.description}</p>
            </div>

            <div className="pt-6 border-t border-gray-700">
              <div className="flex items-center">
                <motion.div 
                  className="h-12 w-12 rounded-full overflow-hidden mr-4 bg-gray-700"
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
                  <p className="text-lg font-semibold text-yellow-400">
                    {workout.user?.username || "Unknown User"}
                  </p>
                  <p className="text-sm text-gray-400">
                    Posted on {new Date(workout.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default WorkoutDetails;