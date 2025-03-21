import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { profile } from "../services/authService";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1,
    transition: { type: "spring", stiffness: 120 }
  }
};

const loadingContainerVariants = {
  start: { transition: { staggerChildren: 0.1 } },
  end: { transition: { staggerChildren: 0.1 } },
};

const loadingCircleVariants = {
  start: { y: "0%" },
  end: { y: "100%" },
};

const loadingCircleTransition = {
  duration: 0.5,
  yoyo: Infinity,
  ease: "easeInOut"
};

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await profile();
        setUserData(response.data);
      } catch (error) {
        setError("Failed to fetch profile data.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleImageError = () => {
    setImageError(true);
  };

  const calculateBMI = () => {
    const height = userData?.height || 175;
    const weight = userData?.weight || 70;
    const heightInMeters = height / 100;
    const bmi = weight / (heightInMeters * heightInMeters);
    return Math.round(bmi * 10) / 10;
  };

  const calculateHealthScore = () => {
    const bmi = calculateBMI();
    let healthScore;

    if (bmi < 16) healthScore = 40;
    else if (bmi < 18.5) healthScore = 60 + ((18.5 - bmi) * 5);
    else if (bmi <= 24.9) {
      const distanceFromOptimal = Math.abs(bmi - 21.7);
      healthScore = 95 - (distanceFromOptimal * 3);
    } else if (bmi <= 29.9) healthScore = 75 - ((bmi - 24.9) * 4);
    else if (bmi <= 34.9) healthScore = 55 - ((bmi - 29.9) * 3);
    else if (bmi <= 39.9) healthScore = 40 - ((bmi - 34.9) * 2);
    else healthScore = 30;

    return Math.max(0, Math.min(100, Math.round(healthScore)));
  };

  const getBMICategory = (bmi) => {
    if (bmi < 16) return "Severely Underweight";
    if (bmi < 18.5) return "Underweight";
    if (bmi < 25) return "Normal Weight";
    if (bmi < 30) return "Overweight";
    if (bmi < 35) return "Obesity Class I";
    if (bmi < 40) return "Obesity Class II";
    return "Obesity Class III";
  };

  const getHealthStatus = (score) => {
    if (score < 40) return { status: "Needs Improvement", color: "#ef4444" };
    if (score < 60) return { status: "Fair", color: "#f59e0b" };
    if (score < 80) return { status: "Good", color: "#10b981" };
    return { status: "Excellent", color: "#22c55e" };
  };

  const bmi = calculateBMI();
  const bmiCategory = getBMICategory(bmi);
  const healthScore = calculateHealthScore();
  const healthStatus = getHealthStatus(healthScore);
  const circumference = 2 * Math.PI * 48;
  const dashOffset = circumference - (circumference * healthScore) / 100;

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-900">
        <motion.div
          variants={loadingContainerVariants}
          initial="start"
          animate="end"
          className="flex flex-col items-center space-y-4"
        >
          <motion.div
            className="h-16 w-16 rounded-full bg-gradient-to-r from-yellow-500 to-yellow-600"
            animate={{
              rotate: 360,
              scale: [1, 1.2, 1]
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <div className="h-full w-full rounded-full bg-gray-900 p-2">
              <div className="h-full w-full rounded-full bg-gradient-to-r from-yellow-500 to-yellow-600" />
            </div>
          </motion.div>
          
          <motion.div
            className="flex space-x-2"
            variants={loadingContainerVariants}
          >
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className="h-3 w-3 rounded-full bg-yellow-500"
                variants={loadingCircleVariants}
                transition={loadingCircleTransition}
              />
            ))}
          </motion.div>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="flex h-screen items-center justify-center bg-gray-900"
      >
        <div className="w-full max-w-md rounded-lg bg-gray-800 p-8 shadow-lg">
          <div className="flex items-center justify-center text-red-500">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h2 className="mt-4 text-center text-xl font-bold text-white">Error</h2>
          <p className="mt-2 text-center text-gray-400">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-6 w-full rounded-lg bg-yellow-500 py-2 font-medium text-gray-900 hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 focus:ring-offset-gray-800"
          >
            Try Again
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-gray-900 py-12 relative"
    >
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none"
      >
        <div className="absolute top-24 left-10 w-64 h-64 bg-yellow-500 opacity-5 rounded-full"></div>
        <div className="absolute bottom-32 right-10 w-80 h-80 bg-yellow-400 opacity-5 rounded-full"></div>
        <div className="absolute top-1/2 left-1/3 w-40 h-40 bg-gray-600 opacity-10 rounded-full"></div>
        <div className="absolute top-1/4 right-1/4 w-32 h-32 bg-gray-700 opacity-10 rounded-full"></div>
      </motion.div>

      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="overflow-hidden rounded-xl bg-gray-800 shadow"
        >
          <motion.div variants={itemVariants} className="relative h-32 bg-gradient-to-r from-yellow-500 to-yellow-600">
            <div className="absolute -bottom-16 left-8">
              {userData?.profileImageUrl && !imageError ? (
                <motion.img
                  src={userData?.profileImageUrl}
                  alt={`${userData.username}'s profile`}
                  onError={handleImageError}
                  className="h-32 w-32 rounded-full border-4 border-gray-800 object-cover shadow-lg"
                  whileHover={{ scale: 1.05 }}
                />
              ) : (
                <motion.div
                  className="flex h-32 w-32 items-center justify-center rounded-full border-4 border-gray-800 bg-gray-700 text-4xl font-bold text-gray-300 shadow-lg"
                  whileHover={{ scale: 1.05 }}
                >
                  {userData?.username?.charAt(0).toUpperCase() || "U"}
                </motion.div>
              )}
            </div>
          </motion.div>

          <div className="mt-16 px-8 pb-8 pt-4">
            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h1 className="text-3xl font-bold text-white">{userData?.username || "User"}</h1>
                <p className="mt-1 text-lg text-gray-400">
                  {userData?.role ? userData.role.charAt(0).toUpperCase() + userData.role.slice(1) : "Member"}
                </p>
              </div>
              <div className="mt-4 sm:mt-0">
                <motion.button
                  className="rounded-lg bg-yellow-500 px-4 py-2 font-medium text-gray-900 hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 focus:ring-offset-gray-800"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Edit Profile
                </motion.button>
              </div>
            </motion.div>

            <motion.div variants={containerVariants} className="mt-8 grid gap-6 sm:grid-cols-2">
              <motion.div variants={itemVariants} className="space-y-6 rounded-lg bg-gray-700 p-6 shadow-sm">
                <h2 className="text-xl font-bold text-white">Account Information</h2>
                <div>
                  <h3 className="text-sm font-medium text-gray-400">Username</h3>
                  <p className="mt-1 text-base font-medium text-white">{userData?.username || "N/A"}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-400">Email</h3>
                  <p className="mt-1 text-base font-medium text-white">{userData?.email || "N/A"}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-400">Role</h3>
                  <p className="mt-1 inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-sm font-medium text-yellow-800">
                    {userData?.role || "Member"}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-400">Member Since</h3>
                  <p className="mt-1 text-base font-medium text-white">
                    {userData?.createdAt ? new Date(userData.createdAt).toLocaleDateString() : "N/A"}
                  </p>
                </div>
              </motion.div>

              <motion.div variants={itemVariants} className="space-y-6 rounded-lg bg-gray-700 p-6 shadow-sm">
                <h2 className="text-xl font-bold text-white">Fitness Statistics</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-lg bg-gray-800 p-4 shadow-sm">
                    <h3 className="text-sm font-medium text-gray-400">Workouts</h3>
                    <p className="mt-1 text-2xl font-bold text-yellow-500">{userData?.stats?.workouts || 0}</p>
                  </div>
                  <div className="rounded-lg bg-gray-800 p-4 shadow-sm">
                    <h3 className="text-sm font-medium text-gray-400">Active Days</h3>
                    <p className="mt-1 text-2xl font-bold text-yellow-500">{userData?.stats?.activeDays || 0}</p>
                  </div>
                  <div className="rounded-lg bg-gray-800 p-4 shadow-sm">
                    <h3 className="text-sm font-medium text-gray-400">Goals Set</h3>
                    <p className="mt-1 text-2xl font-bold text-yellow-500">{userData?.stats?.goals || 0}</p>
                  </div>
                  <div className="rounded-lg bg-gray-800 p-4 shadow-sm">
                    <h3 className="text-sm font-medium text-gray-400">Goals Completed</h3>
                    <p className="mt-1 text-2xl font-bold text-yellow-500">{userData?.stats?.goalsCompleted || 0}</p>
                  </div>
                </div>
                <div>
                  <h3 className="mb-2 text-sm font-medium text-gray-400">Current Plan</h3>
                  <div className="rounded-lg bg-gray-900 p-4 text-white">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{userData?.plan?.name || "Free Plan"}</span>
                      <span className="rounded-full bg-yellow-500 px-2 py-1 text-xs font-bold text-gray-900">
                        {userData?.plan?.status || "Active"}
                      </span>
                    </div>
                    <div className="mt-2 text-sm text-gray-300">
                      {userData?.plan?.description || "Basic fitness tracking features."}
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>

            <motion.div variants={itemVariants} className="mt-8 rounded-lg bg-gray-700 p-6 shadow-sm">
              <h2 className="mb-6 text-xl font-bold text-white text-center">Your Body Health Status</h2>
              <div className="flex flex-col md:flex-row items-center justify-around">
                <motion.div 
                  className="relative flex items-center justify-center mb-6 md:mb-0"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 120 }}
                >
                  <svg width="150" height="150" viewBox="0 0 120 120">
                    <circle
                      cx="60"
                      cy="60"
                      r="48"
                      fill="none"
                      strokeWidth="12"
                      stroke="#374151"
                    />
                    <motion.circle
                      cx="60"
                      cy="60"
                      r="48"
                      fill="none"
                      strokeWidth="12"
                      stroke={healthStatus.color}
                      strokeLinecap="round"
                      strokeDasharray={circumference}
                      initial={{ strokeDashoffset: circumference }}
                      animate={{ strokeDashoffset: dashOffset }}
                      transition={{ duration: 1.5, ease: "easeInOut" }}
                      transform="rotate(-90 60 60)"
                    />
                    <text
                      x="60"
                      y="55"
                      fontSize="24"
                      fontWeight="bold"
                      textAnchor="middle"
                      fill="white"
                    >
                      {healthScore}%
                    </text>
                    <text
                      x="60"
                      y="75"
                      fontSize="12"
                      textAnchor="middle"
                      fill="#e5e7eb"
                    >
                      Health Score
                    </text>
                  </svg>
                </motion.div>
                <div className="w-full md:w-1/2">
                  <h3 className="text-lg font-bold mb-2" style={{ color: healthStatus.color }}>
                    {healthStatus.status}
                  </h3>
                  <p className="text-gray-300 mb-4">
                    Based on your body metrics, your overall health status is 
                    <span className="font-semibold" style={{ color: healthStatus.color }}> {healthStatus.status.toLowerCase()}</span>.
                    Your BMI is <span className="font-semibold">{bmi}</span>, which is classified as <span className="font-semibold">{bmiCategory}</span>.
                    {healthScore < 60 ? 
                      " We recommend focusing on improving your health through targeted workouts and nutrition." : 
                      " You're in a healthy range, but continuing with your fitness routine will help maintain or further improve your health."}
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-gray-800 p-3 rounded-lg">
                      <h4 className="text-sm text-gray-400">Height</h4>
                      <p className="font-medium text-white">{userData?.height || "175"} cm</p>
                    </div>
                    <div className="bg-gray-800 p-3 rounded-lg">
                      <h4 className="text-sm text-gray-400">Weight</h4>
                      <p className="font-medium text-white">{userData?.weight || "70"} kg</p>
                    </div>
                    <div className="bg-gray-800 p-3 rounded-lg">
                      <h4 className="text-sm text-gray-400">BMI</h4>
                      <p className="font-medium text-white">{bmi}</p>
                    </div>
                    <div className="bg-gray-800 p-3 rounded-lg">
                      <h4 className="text-sm text-gray-400">BMI Category</h4>
                      <p className="font-medium text-white">{bmiCategory}</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-6 bg-gray-800 rounded-lg p-4">
                <h3 className="text-md font-bold text-white mb-2">Recommendations</h3>
                <ul className="text-gray-300 space-y-2">
                  {bmi < 18.5 ? (
                    <>
                      <li className="flex items-start">
                        <svg className="h-5 w-5 text-yellow-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Increase your caloric intake with nutrient-dense foods
                      </li>
                      <li className="flex items-start">
                        <svg className="h-5 w-5 text-yellow-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Focus on strength training to build muscle mass
                      </li>
                      <li className="flex items-start">
                        <svg className="h-5 w-5 text-yellow-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Consider consulting with a nutritionist for a personalized meal plan
                      </li>
                    </>
                  ) : bmi >= 18.5 && bmi < 25 ? (
                    <>
                      <li className="flex items-start">
                        <svg className="h-5 w-5 text-yellow-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Maintain your balanced diet and exercise routine
                      </li>
                      <li className="flex items-start">
                        <svg className="h-5 w-5 text-yellow-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Mix cardio and strength training for optimal fitness
                      </li>
                      <li className="flex items-start">
                        <svg className="h-5 w-5 text-yellow-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Focus on building endurance and fitness level rather than weight changes
                      </li>
                    </>
                  ) : (
                    <>
                      <li className="flex items-start">
                        <svg className="h-5 w-5 text-yellow-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Create a caloric deficit through a combination of diet and increased physical activity
                      </li>
                      <li className="flex items-start">
                        <svg className="h-5 w-5 text-yellow-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Incorporate more cardio exercises into your routine
                      </li>
                      <li className="flex items-start">
                        <svg className="h-5 w-5 text-yellow-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Focus on reducing processed foods and increasing fruit and vegetable intake
                      </li>
                    </>
                  )}
                </ul>
              </div>
            </motion.div>

            <motion.div 
              variants={itemVariants}
              className="mt-8 flex justify-center"
            >
              <motion.div 
                className="inline-flex rounded-md" 
                role="group"
                whileHover={{ scale: 1.05 }}
              >
                <button className="rounded-l-lg border border-gray-600 bg-gray-700 px-4 py-2 text-sm font-medium text-gray-300 hover:bg-gray-600 focus:z-10 focus:outline-none focus:ring-2 focus:ring-yellow-500">
                  Workout History
                </button>
                <button className="border-b border-t border-gray-600 bg-gray-700 px-4 py-2 text-sm font-medium text-gray-300 hover:bg-gray-600 focus:z-10 focus:outline-none focus:ring-2 focus:ring-yellow-500">
                  Nutrition Log
                </button>
                <button className="rounded-r-lg border border-gray-600 bg-gray-700 px-4 py-2 text-sm font-medium text-gray-300 hover:bg-gray-600 focus:z-10 focus:outline-none focus:ring-2 focus:ring-yellow-500">
                  Body Metrics
                </button>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Profile;