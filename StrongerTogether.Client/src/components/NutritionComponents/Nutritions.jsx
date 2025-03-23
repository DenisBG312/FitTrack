import React, { useState, useEffect } from "react";
import axios from "axios";
import AddNutritionLog from './AddNutritionLog';

const Nutrition = () => {
  const [nutritionLogs, setNutritionLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);

  const fetchNutritionLogs = async () => {
    try {
      const response = await axios.get("https://localhost:7039/api/NutritionLog", {
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

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const getMealTypeIcon = (mealType) => {
    switch (mealType) {
      case "Breakfast":
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 2a6 6 0 100 12A6 6 0 0010 4z" clipRule="evenodd" />
          </svg>
        );
      case "Lunch":
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
            <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
          </svg>
        );
      case "Dinner":
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V5z" clipRule="evenodd" />
          </svg>
        );
      default:
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
          </svg>
        );
    }
  };


  const calculateTotalNutrition = () => {
    return nutritionLogs.reduce(
      (totals, log) => {
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

  const filteredLogs = nutritionLogs.filter((log) => {
    const matchesTab = activeTab === "all" || log.mealType.toLowerCase() === activeTab.toLowerCase();
    const matchesSearch = log.foodName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const totals = calculateTotalNutrition();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
          <p className="mt-4 text-yellow-500 font-medium">Loading your nutrition data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="bg-red-900 text-white p-6 rounded-lg shadow-xl max-w-md mx-auto">
          <h2 className="text-xl font-bold mb-2">Error</h2>
          <p>{error}</p>
          <button className="mt-4 bg-red-700 hover:bg-red-600 text-white py-2 px-4 rounded transition-colors duration-300">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-yellow-500 mb-2">Nutrition Journal</h1>
            <p className="text-gray-400">Track your daily nutrition intake and macros</p>
          </div>
          <div className="mt-4 md:mt-0">
            <button
              onClick={toggleAddModal}
              className="bg-yellow-500 hover:bg-yellow-400 text-gray-900 font-semibold py-2 px-6 rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105"
            >
              Add New Entry
            </button>
          </div>
        </div>

        {showAddModal && (
          <AddNutritionLog
            onClose={() => setShowAddModal(false)}
            onLogAdded={handleAddNutritionLog}
          />
        )}

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gray-800 rounded-lg shadow-lg p-4 border-l-4 border-yellow-500">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-500 bg-opacity-20 rounded">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-gray-400 text-sm">Total Calories</p>
                <p className="text-2xl font-bold text-white">{totals.calories}</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg shadow-lg p-4 border-l-4 border-green-500">
            <div className="flex items-center">
              <div className="p-2 bg-green-500 bg-opacity-20 rounded">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-gray-400 text-sm">Protein</p>
                <p className="text-2xl font-bold text-white">{totals.protein}g</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg shadow-lg p-4 border-l-4 border-blue-500">
            <div className="flex items-center">
              <div className="p-2 bg-blue-500 bg-opacity-20 rounded">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-gray-400 text-sm">Carbs</p>
                <p className="text-2xl font-bold text-white">{totals.carbs}g</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg shadow-lg p-4 border-l-4 border-purple-500">
            <div className="flex items-center">
              <div className="p-2 bg-purple-500 bg-opacity-20 rounded">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-gray-400 text-sm">Fats</p>
                <p className="text-2xl font-bold text-white">{totals.fats}g</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg shadow-lg p-4 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="flex space-x-2 mb-4 md:mb-0">
              <button
                onClick={() => setActiveTab("all")}
                className={`px-4 py-2 rounded-lg transition-colors duration-200 ${
                  activeTab === "all"
                    ? "bg-yellow-500 text-gray-900 font-medium"
                    : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                }`}
              >
                All
              </button>
              <button
                onClick={() => setActiveTab("breakfast")}
                className={`px-4 py-2 rounded-lg transition-colors duration-200 ${
                  activeTab === "breakfast"
                    ? "bg-yellow-500 text-gray-900 font-medium"
                    : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                }`}
              >
                Breakfast
              </button>
              <button
                onClick={() => setActiveTab("lunch")}
                className={`px-4 py-2 rounded-lg transition-colors duration-200 ${
                  activeTab === "lunch"
                    ? "bg-yellow-500 text-gray-900 font-medium"
                    : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                }`}
              >
                Lunch
              </button>
              <button
                onClick={() => setActiveTab("dinner")}
                className={`px-4 py-2 rounded-lg transition-colors duration-200 ${
                  activeTab === "dinner"
                    ? "bg-yellow-500 text-gray-900 font-medium"
                    : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                }`}
              >
                Dinner
              </button>
            </div>
            <div className="relative">
              <input
                type="text"
                placeholder="Search food..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-gray-700 text-white px-4 py-2 pl-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 w-full md:w-64"
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-gray-400 absolute left-3 top-2.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {filteredLogs.length === 0 ? (
            <div className="bg-gray-800 rounded-lg shadow-lg p-8 text-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="text-xl font-medium text-gray-300 mb-2">No nutrition logs found</h3>
              <p className="text-gray-500">Try changing your filters or add a new log entry</p>
            </div>
          ) : (
            filteredLogs.map((log) => (
              <div key={log.id} className="bg-gray-800 rounded-lg shadow-lg overflow-hidden transform transition-all duration-300 hover:shadow-xl hover:scale-102">
                <div className="flex flex-col md:flex-row">
                  <div className="md:w-1/4 bg-gradient-to-br from-yellow-600 to-yellow-400 p-6 flex flex-col justify-center items-center text-gray-900">
                    <div className="text-3xl font-bold">{formatDate(log.date)}</div>
                    <div className="flex items-center mt-2">
                      {getMealTypeIcon(log.mealType)}
                      <span className="ml-2 font-semibold">{log.mealType}</span>
                    </div>
                  </div>
                  <div className="md:w-3/4 p-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                      <h3 className="text-xl font-bold text-white mb-2 md:mb-0">{log.foodName}</h3>
                      <div className="flex space-x-2">
                        <button className="text-blue-400 hover:text-blue-300 transition-colors duration-200">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                          </svg>
                        </button>
                        <button className="text-red-400 hover:text-red-300 transition-colors duration-200">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="bg-gray-700 rounded-lg p-3">
                        <p className="text-yellow-400 text-sm mb-1">Calories</p>
                        <p className="text-xl font-bold text-white">{log.calories}</p>
                      </div>
                      <div className="bg-gray-700 rounded-lg p-3">
                        <p className="text-green-400 text-sm mb-1">Protein</p>
                        <p className="text-xl font-bold text-white">{log.protein}g</p>
                      </div>
                      <div className="bg-gray-700 rounded-lg p-3">
                        <p className="text-blue-400 text-sm mb-1">Carbs</p>
                        <p className="text-xl font-bold text-white">{log.carbs}g</p>
                      </div>
                      <div className="bg-gray-700 rounded-lg p-3">
                        <p className="text-purple-400 text-sm mb-1">Fats</p>
                        <p className="text-xl font-bold text-white">{log.fats}g</p>
                      </div>
                    </div>
                    <div className="flex items-center mt-4 text-gray-400 text-sm">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      {log.user.username}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Nutrition;