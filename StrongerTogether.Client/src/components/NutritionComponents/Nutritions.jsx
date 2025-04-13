import React, { useState, useEffect } from "react";
import axios from "axios";
import AddNutritionLog from './AddNutritionLog';
import LoadingSpinner from "../LoadingSpinner";
// eslint-disable-next-line no-unused-vars
import { AnimatePresence, motion } from "framer-motion";
import { format, parseISO, isSameDay } from "date-fns";
import Footer from "../Footer";

const formatNumber = (num) => {
  return Number(num).toFixed(1).replace('.0', '');
};

const Nutrition = () => {
  const API_URL = import.meta.env.VITE_PUBLIC_API_URL;
  const [nutritionLogs, setNutritionLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [sortOrder, setSortOrder] = useState("desc");
  const [selectedDate, setSelectedDate] = useState("");

  useEffect(() => {
    if (showAddModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showAddModal]);

  const fetchNutritionLogs = async () => {
    try {
      const response = await axios.get(`${API_URL}/NutritionLog`, {
        withCredentials: true,
      });
      setNutritionLogs(response.data);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch nutrition logs.");
      setLoading(false);
      console.log(err);
    }
  };

  useEffect(() => {
    fetchNutritionLogs();
  }, []);

  const handleAddNutritionLog = () => {
    fetchNutritionLogs();
    setShowAddModal(false);
  };

  const toggleAddModal = () => {
    setShowAddModal(!showAddModal);
  };

  const toggleSortOrder = () => {
    setSortOrder(prev => prev === "asc" ? "desc" : "asc");
  };

  const getMealTypeIcon = (mealType) => {
    switch (mealType) {
      case "Breakfast":
        return <span className="text-yellow-400 mr-1">🍳</span>;
      case "Lunch":
        return <span className="text-green-400 mr-1">🥪</span>;
      case "Dinner":
        return <span className="text-blue-400 mr-1">🍲</span>;
      case "Snack":
        return <span className="text-purple-400 mr-1">🍎</span>;
      default:
        return <span className="text-gray-400 mr-1">🍽️</span>;
    }
  };

  const calculateTotalNutrition = () => {
    return nutritionLogs.reduce(
      (totals, log) => {
        const logDate = format(parseISO(log.date), 'yyyy-MM-dd');
        if (selectedDate && logDate !== selectedDate) return totals;

        return {
          calories: totals.calories + log.calories,
          protein: totals.protein + log.protein,
          carbs: totals.carbs + log.carbs,
          fats: totals.fats + log.fats,
        };
      },
      { calories: 0, protein: 0, carbs: 0, fats: 0 }
    );
  };

  const filteredLogs = nutritionLogs
    .filter((log) => {
      const matchesTab = activeTab === "all" || log.mealType.toLowerCase() === activeTab.toLowerCase();
      const matchesSearch = log.foodName.toLowerCase().includes(searchTerm.toLowerCase());
      const logDate = format(parseISO(log.date), 'yyyy-MM-dd');
      const matchesDate = !selectedDate || logDate === selectedDate;
      return matchesTab && matchesSearch && matchesDate;
    })
    .sort((a, b) => {
      const dateA = parseISO(a.date);
      const dateB = parseISO(b.date);
      return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
    });

  const totals = calculateTotalNutrition();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center">
        <div className="flex flex-col items-center">
          <LoadingSpinner />
          <p className="mt-4 text-yellow-500 font-medium">Loading your nutrition data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center">
        <div className="bg-red-900 text-white p-8 rounded-2xl shadow-2xl max-w-md text-center">
          <h2 className="text-2xl font-bold mb-4">Oops! Something went wrong</h2>
          <p className="mb-6">{error}</p>
          <button
            className="bg-red-600 hover:bg-red-500 text-white py-2 px-6 rounded-full transition-colors duration-300"
            onClick={fetchNutritionLogs}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const groupedLogs = filteredLogs.reduce((acc, log) => {
    const dateKey = format(parseISO(log.date), 'yyyy-MM-dd');
    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    acc[dateKey].push(log);
    return acc;
  }, {});

  const sortedDates = Object.keys(groupedLogs).sort((a, b) => {
    return sortOrder === "asc"
      ? new Date(a) - new Date(b)
      : new Date(b) - new Date(a);
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center"
        >
          <h1 className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-orange-500 mb-3">
            Nutrition Tracker
          </h1>
          <p className="text-gray-400 max-w-xl mx-auto">
            Track your daily nutrition with precision and insight
          </p>
        </motion.div>

        <div className="flex justify-center mb-8">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleAddModal}
            className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-bold py-3 px-6 rounded-full shadow-2xl hover:shadow-yellow-500/50 transition-all duration-300"
          >
            + Add New Entry
          </motion.button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          {[
            { label: "Calories", value: formatNumber(totals.calories), icon: "🔥", color: "from-yellow-500 to-orange-500" },
            { label: "Protein", value: `${formatNumber(totals.protein)}g`, icon: "💪", color: "from-green-500 to-teal-500" },
            { label: "Carbs", value: `${formatNumber(totals.carbs)}g`, icon: "🍞", color: "from-blue-500 to-indigo-500" },
            { label: "Fats", value: `${formatNumber(totals.fats)}g`, icon: "🧈", color: "from-purple-500 to-pink-500" }
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.2, duration: 0.5 }}
              className={`bg-gradient-to-br ${stat.color} p-6 rounded-2xl shadow-2xl bg-opacity-30 hover:scale-105 transition-transform`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-white/70 uppercase tracking-wider">{stat.label}</p>
                  <p className="text-3xl font-bold">{stat.value}</p>
                </div>
                <span className="text-4xl opacity-70">{stat.icon}</span>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-6 mb-12 border border-white/10">
          <div className="flex flex-wrap gap-4 justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="relative">
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="pl-4 pr-2 py-2 bg-gray-700 rounded-full focus:ring-2 focus:ring-yellow-500 transition-all"
                />
                {selectedDate && (
                  <button
                    onClick={() => setSelectedDate("")}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-yellow-500"
                  >
                    ×
                  </button>
                )}
              </div>
              <span className="text-gray-400 text-sm">Filter by date</span>
            </div>

            <div className="flex flex-wrap gap-2">
              {["All", "Breakfast", "Lunch", "Dinner", "Snack"].map((tab) => (
                <motion.button
                  key={tab}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveTab(tab.toLowerCase())}
                  className={`px-4 py-2 rounded-full transition-all duration-300 ${activeTab === tab.toLowerCase()
                      ? "bg-gradient-to-r from-yellow-500 to-orange-500 text-white"
                      : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                    }`}
                >
                  {tab}
                </motion.button>
              ))}
            </div>

            <div className="flex items-center gap-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search foods..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 w-64 bg-gray-700 rounded-full focus:ring-2 focus:ring-yellow-500 transition-all"
                />
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <button
                onClick={toggleSortOrder}
                className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-500 transition-colors"
              >
                {sortOrder === "desc" ? "Newest First" : "Oldest First"}
              </button>
            </div>
          </div>
        </div>

        {sortedDates.length === 0 ? (
          <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-8 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-xl font-medium text-gray-300 mb-2">
              {selectedDate ? `No entries for ${format(new Date(selectedDate), 'MMM do, yyyy')}` : 'No nutrition logs found'}
            </h3>
            <p className="text-gray-500">Try changing your filters or add a new log entry</p>
          </div>
        ) : (
          <div className="space-y-8">
            {sortedDates.map((dateKey) => {
              const date = parseISO(dateKey);
              const logsForDate = groupedLogs[dateKey];
              const isToday = isSameDay(date, new Date());

              return (
                <motion.div
                  key={dateKey}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="bg-gray-800/50 backdrop-blur-lg rounded-2xl overflow-hidden border border-white/10"
                >
                  <div className={`p-4 ${isToday ? 'bg-gradient-to-r from-yellow-500 to-orange-500 bg-opacity-20' : 'bg-gray-700'}`}>
                    <div className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <h3 className="text-lg font-semibold text-white">
                        {format(date, "EEEE, MMMM do yyyy")}
                        {isToday && (
                          <span className="ml-2 bg-white text-orange-500 text-xs font-bold px-2 py-0.5 rounded-full">
                            Today
                          </span>
                        )}
                      </h3>
                    </div>
                  </div>

                  <div className="divide-y divide-gray-700">
                    {logsForDate.map((log) => (
                      <div key={log.id} className="p-4 hover:bg-gray-700/50 transition-colors duration-200">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center mb-1">
                              {getMealTypeIcon(log.mealType)}
                              <span className="ml-2 font-medium text-white">{log.foodName}</span>
                              <span className="ml-2 text-xs bg-gray-700 text-gray-300 px-2 py-0.5 rounded-full">
                                {log.mealType}
                              </span>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4">
                            {[
                              { label: "Calories", value: log.calories, color: "text-yellow-400" },
                              { label: "Protein", value: `${log.protein}g`, color: "text-green-400" },
                              { label: "Carbs", value: `${log.carbs}g`, color: "text-blue-400" },
                              { label: "Fats", value: `${log.fats}g`, color: "text-purple-400" }
                            ].map((nutrient) => (
                              <div key={nutrient.label} className="text-center">
                                <p className="text-xs text-gray-400">{nutrient.label}</p>
                                <p className={`font-bold ${nutrient.color}`}>{nutrient.value}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        <AnimatePresence>
          {showAddModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-hidden"
            >
              <motion.div
                initial={{ scale: 0.95, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl relative max-h-[90vh] overflow-y-auto"
              >
                <button
                  onClick={() => setShowAddModal(false)}
                  className="absolute top-4 right-4 text-gray-400 hover:text-yellow-500 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                <AddNutritionLog
                  onClose={() => setShowAddModal(false)}
                  onLogAdded={handleAddNutritionLog}
                />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <Footer />
    </div>
  );
};

export default Nutrition;