import React, { useState, useEffect } from "react";
import axios from "axios";
import { checkAuth } from "../../services/authService";
import LoadingSpinner from "../LoadingSpinner";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  addMonths,
  subMonths,
  isSameMonth,
  isSameDay,
  isToday,
  startOfWeek,
  endOfWeek
} from 'date-fns';

const AddNutritionLog = ({ onLogAdded }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [formData, setFormData] = useState({
    userId: "",
    foodName: "",
    calories: 0,
    protein: 0,
    carbs: 0,
    fats: 0,
    mealType: "Breakfast",
    date: new Date().toISOString().split("T")[0]
  });
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [showCalendar, setShowCalendar] = useState(false);

  const handleDateChange = (date) => {
    setFormData(prevState => ({
      ...prevState,
      date: format(date, 'yyyy-MM-dd')
    }));
    setShowCalendar(false);

    if (!isSameMonth(date, currentMonth)) {
      setCurrentMonth(startOfMonth(date));
    }
  };

  const renderCalendar = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const startDate = startOfWeek(monthStart, { weekStartsOn: 0 });
    const endDate = endOfWeek(monthEnd, { weekStartsOn: 0 });
    const days = eachDayOfInterval({ start: startDate, end: endDate });

    return (
      <div className="absolute z-10 mt-2 bg-gray-800 border border-gray-700 rounded-lg shadow-xl p-4 w-full max-w-xs">
        <div className="flex justify-between items-center mb-4">
          <button
            type="button"
            onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
            className="text-yellow-500 hover:text-yellow-400 px-2 py-1"
          >
            &larr;
          </button>
          <h3 className="text-gray-300 font-medium">
            {format(currentMonth, 'MMMM yyyy')}
          </h3>
          <button
            type="button"
            onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
            className="text-yellow-500 hover:text-yellow-400 px-2 py-1"
          >
            &rarr;
          </button>
        </div>
        <div className="grid grid-cols-7 gap-1">
          {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => (
            <div key={day} className="text-center text-gray-400 text-xs font-medium pb-1">
              {day}
            </div>
          ))}
          {days.map((day, index) => {
            const isCurrentMonthDay = isSameMonth(day, currentMonth);
            const isSelectedDay = isSameDay(day, new Date(formData.date));
            const isTodayDay = isToday(day);
            
            return (
              <button
                key={index}
                type="button"
                onClick={() => handleDateChange(day)}
                disabled={!isCurrentMonthDay}
                className={`
                  text-center p-1 rounded-full text-xs transition-colors
                  ${isSelectedDay 
                    ? 'bg-yellow-500 text-gray-900 font-bold' 
                    : isTodayDay 
                      ? 'bg-gray-700 text-yellow-400 font-bold' 
                      : isCurrentMonthDay 
                        ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' 
                        : 'bg-gray-800 text-gray-500 cursor-not-allowed'
                  }
                `}
              >
                {format(day, 'd')}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const userData = await checkAuth();
        setUser(userData);
        setFormData(prevState => ({
          ...prevState,
          userId: userData.id
        }));
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch user profile. Please log in again.");
        setLoading(false);
        console.error(err);
      }
    };

    fetchUserProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (["calories", "protein", "carbs", "fats"].includes(name)) {
      const numValue = parseFloat(value) || 0;
      setFormData(prevState => ({
        ...prevState,
        [name]: numValue
      }));
    } else {
      setFormData(prevState => ({
        ...prevState,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMessage("");

    try {
      const apiFormData = {
        ...formData,
        date: new Date(formData.date).toISOString()
      };

      const response = await axios.post(
        "https://localhost:7039/api/NutritionLog",
        apiFormData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json"
          }
        }
      );

      setSuccessMessage("Nutrition log added successfully!");
      setFormData({
        userId: user.id,
        foodName: "",
        calories: 0,
        protein: 0,
        carbs: 0,
        fats: 0,
        mealType: "Breakfast",
        date: new Date().toISOString().split("T")[0]
      });

      setLoading(false);

      if (onLogAdded && typeof onLogAdded === 'function') {
        onLogAdded(response.data);
      }

      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      setError("Failed to add nutrition log. Please try again.");
      setLoading(false);
      console.error(err);
    }
  };

  const calculateTotalCalories = () => {
    const proteinCalories = formData.protein * 4;
    const carbCalories = formData.carbs * 4;
    const fatCalories = formData.fats * 9;
    return proteinCalories + carbCalories + fatCalories;
  };

  const calculateMacroPercentages = () => {
    const totalCalories = calculateTotalCalories();

    if (totalCalories === 0) {
      return {
        proteinPercent: 0,
        carbPercent: 0,
        fatPercent: 0
      };
    }

    return {
      proteinPercent: Math.round((formData.protein * 4 / totalCalories) * 100),
      carbPercent: Math.round((formData.carbs * 4 / totalCalories) * 100),
      fatPercent: Math.round((formData.fats * 9 / totalCalories) * 100)
    };
  };

  const { proteinPercent, carbPercent, fatPercent } = calculateMacroPercentages();

  if (loading && !user) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <LoadingSpinner />
          <p className="mt-4 text-yellow-500 font-medium">Loading user data...</p>
        </div>
      </div>
    );
  }

  if (error && !user) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="bg-red-900 text-white p-6 rounded-lg shadow-xl max-w-md mx-auto">
          <h2 className="text-xl font-bold mb-2">Error</h2>
          <p>{error}</p>
          <button
            className="mt-4 bg-red-700 hover:bg-red-600 text-white py-2 px-4 rounded transition-colors duration-300"
            onClick={() => window.location.href = "/login"}
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-yellow-500 mb-6">Add Nutrition Log</h2>

      {successMessage && (
        <div className="mb-6 bg-green-900 border-l-4 border-green-500 p-4 rounded-lg text-green-200">
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            {successMessage}
          </div>
        </div>
      )}

      {error && (
        <div className="mb-6 bg-red-900 border-l-4 border-red-500 p-4 rounded-lg text-red-200">
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {error}
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="col-span-1 md:col-span-2">
            <label htmlFor="foodName" className="block text-gray-300 mb-2">
              Food Name
            </label>
            <input
              type="text"
              id="foodName"
              name="foodName"
              value={formData.foodName}
              onChange={handleChange}
              className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
              placeholder="e.g. Grilled Chicken Salad"
              required
            />
          </div>

          <div>
            <label htmlFor="mealType" className="block text-gray-300 mb-2">
              Meal Type
            </label>
            <select
              id="mealType"
              name="mealType"
              value={formData.mealType}
              onChange={handleChange}
              className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
              required
            >
              <option value="Breakfast">Breakfast</option>
              <option value="Lunch">Lunch</option>
              <option value="Dinner">Dinner</option>
              <option value="Snack">Snack</option>
            </select>
          </div>

          <div className="relative">
            <label htmlFor="date" className="block text-gray-300 mb-2">
              Date
            </label>
            <div className="relative">
              <input
                type="text"
                id="date"
                name="date"
                value={format(new Date(formData.date), 'MMMM d, yyyy')}
                onClick={() => setShowCalendar(!showCalendar)}
                readOnly
                className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500 cursor-pointer"
                required
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
            {showCalendar && renderCalendar()}
          </div>

          <div>
            <label htmlFor="calories" className="block text-gray-300 mb-2">
              Calories
            </label>
            <div className="relative">
              <input
                type="number"
                id="calories"
                name="calories"
                value={formData.calories}
                onChange={handleChange}
                min="0"
                step="1"
                className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                required
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <span className="text-gray-500">kcal</span>
              </div>
            </div>
          </div>

          <div>
            <label htmlFor="protein" className="block text-gray-300 mb-2">
              Protein
            </label>
            <div className="relative">
              <input
                type="number"
                id="protein"
                name="protein"
                value={formData.protein}
                onChange={handleChange}
                min="0"
                step="0.1"
                className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                required
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <span className="text-gray-500">g</span>
              </div>
            </div>
          </div>

          <div>
            <label htmlFor="carbs" className="block text-gray-300 mb-2">
              Carbs
            </label>
            <div className="relative">
              <input
                type="number"
                id="carbs"
                name="carbs"
                value={formData.carbs}
                onChange={handleChange}
                min="0"
                step="0.1"
                className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                required
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <span className="text-gray-500">g</span>
              </div>
            </div>
          </div>

          <div>
            <label htmlFor="fats" className="block text-gray-300 mb-2">
              Fats
            </label>
            <div className="relative">
              <input
                type="number"
                id="fats"
                name="fats"
                value={formData.fats}
                onChange={handleChange}
                min="0"
                step="0.1"
                className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                required
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <span className="text-gray-500">g</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 p-4 rounded-lg">
          <h3 className="text-gray-300 mb-3">Macronutrient Breakdown</h3>
          <div className="h-6 bg-gray-700 rounded-full overflow-hidden flex">
            <div
              className="bg-green-500 h-full flex items-center justify-center text-xs text-white"
              style={{ width: `${proteinPercent}%` }}
            >
              {formData.protein > 0 ? 'P' : ''}
            </div>
            <div
              className="bg-blue-500 h-full flex items-center justify-center text-xs text-white"
              style={{ width: `${carbPercent}%` }}
            >
              {formData.carbs > 0 ? 'C' : ''}
            </div>
            <div
              className="bg-purple-500 h-full flex items-center justify-center text-xs text-white"
              style={{ width: `${fatPercent}%` }}
            >
              {formData.fats > 0 ? 'F' : ''}
            </div>
          </div>
          <div className="mt-2 flex justify-between text-xs text-gray-400">
            <span>Protein: {proteinPercent}%</span>
            <span>Carbs: {carbPercent}%</span>
            <span>Fats: {fatPercent}%</span>
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => {
              setFormData({
                userId: user?.id || "",
                foodName: "",
                calories: 0,
                protein: 0,
                carbs: 0,
                fats: 0,
                mealType: "Breakfast",
                date: new Date().toISOString().split("T")[0]
              });
              setCurrentMonth(new Date());
            }}
            className="px-6 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors duration-300"
          >
            Reset
          </button>
          <button
            type="submit"
            disabled={loading}
            className={`px-6 py-2 bg-yellow-500 text-gray-900 font-medium rounded-lg hover:bg-yellow-400 transition-colors duration-300 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {loading ? (
              <div className="flex items-center">
                <div className="animate-spin h-4 w-4 border-2 border-gray-900 border-t-transparent rounded-full mr-2"></div>
                Saving...
              </div>
            ) : (
              'Add Log Entry'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddNutritionLog;