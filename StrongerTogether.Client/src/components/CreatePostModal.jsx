import React, { useState, useEffect } from "react";
import axios from "axios";
import { XMarkIcon, ArrowUpTrayIcon } from "@heroicons/react/24/outline";
import moment from "moment";

const CreatePostModal = ({ isOpen, onClose, onPostCreated }) => {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    imageFile: null,
    workoutId: "",
    nutritionLogId: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [workouts, setWorkouts] = useState([]);
  const [nutritions, setNutritions] = useState([]);
  const [loadingWorkouts, setLoadingWorkouts] = useState(false);
  const [loadingNutritions, setLoadingNutritions] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchWorkouts();
      fetchNutritionLogs();
    }
  }, [isOpen]);

  const fetchWorkouts = async () => {
    setLoadingWorkouts(true);
    try {
      const response = await axios.get("https://localhost:7039/api/Workout", {
        withCredentials: true
      });
      setWorkouts(response.data);
    } catch (error) {
      console.error("Error fetching workouts:", error);
    } finally {
      setLoadingWorkouts(false);
    }
  };

  const fetchNutritionLogs = async () => {
    setLoadingNutritions(true);
    try {
      const response = await axios.get("https://localhost:7039/api/NutritionLog", {
        withCredentials: true
      });
      setNutritions(response.data);
    } catch (error) {
      console.error("Error fetching nutrition logs:", error);
    } finally {
      setLoadingNutritions(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const data = new FormData();
    data.append("title", formData.title);
    data.append("content", formData.content);
    if (formData.imageFile) data.append("imageFile", formData.imageFile);
    if (formData.workoutId) data.append("workoutId", formData.workoutId);
    if (formData.nutritionLogId) data.append("nutritionLogId", formData.nutritionLogId);

    try {
      const response = await axios.post("https://localhost:7039/api/Post", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true
      });

      onPostCreated(response.data);
      onClose();
      setFormData({
        title: "",
        content: "",
        imageFile: null,
        workoutId: "",
        nutritionLogId: ""
      });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create post");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-gray-800 rounded-xl w-full max-w-lg p-6 relative shadow-xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
          aria-label="Close modal"
        >
          <XMarkIcon className="h-6 w-6" />
        </button>

        <h2 className="text-2xl font-bold mb-6 text-white">Create New Post</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="post-title" className="block text-sm font-medium mb-2 text-gray-300">
              Title
            </label>
            <input
              id="post-title"
              type="text"
              required
              className="w-full bg-gray-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-yellow-500 focus:border-transparent placeholder-gray-400"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="What's your post about?"
              maxLength={120}
            />
          </div>

          <div>
            <label htmlFor="post-content" className="block text-sm font-medium mb-2 text-gray-300">
              Content
            </label>
            <textarea
              id="post-content"
              required
              className="w-full bg-gray-700 rounded-lg p-3 text-white h-32 focus:ring-2 focus:ring-yellow-500 focus:border-transparent placeholder-gray-400"
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              placeholder="Share your thoughts..."
            />
          </div>

          {/* Workout Selection Dropdown */}
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-300">
              Link Workout (Optional)
            </label>
            <select
              name="workoutId"
              value={formData.workoutId}
              onChange={handleSelectChange}
              className="w-full bg-gray-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              disabled={loadingWorkouts}
            >
              <option value="">No workout selected</option>
              {loadingWorkouts ? (
                <option disabled>Loading workouts...</option>
              ) : (
                workouts.map(workout => (
                  <option key={workout.id} value={workout.id}>
                    {workout.title} - {moment(workout.createdAt).format('MMM D, YYYY')}
                  </option>
                ))
              )}
            </select>
          </div>

          {/* Nutrition Log Selection Dropdown */}
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-300">
              Link Nutrition Log (Optional)
            </label>
            <select
              name="nutritionLogId"
              value={formData.nutritionLogId}
              onChange={handleSelectChange}
              className="w-full bg-gray-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              disabled={loadingNutritions}
            >
              <option value="">No nutrition log selected</option>
              {loadingNutritions ? (
                <option disabled>Loading nutrition logs...</option>
              ) : (
                nutritions.map(nutrition => (
                  <option key={nutrition.id} value={nutrition.id}>
                    {nutrition.foodName} - {moment(nutrition.date).format('MMM D, YYYY')}
                  </option>
                ))
              )}
            </select>
          </div>

          {/* Image Upload Section */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-300">
              Add Media (Optional)
            </label>
            <div className="flex items-center justify-center w-full">
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-600 rounded-lg cursor-pointer hover:border-yellow-500 hover:bg-gray-700/30 transition-all duration-200 group">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <ArrowUpTrayIcon className="h-8 w-8 text-gray-400 group-hover:text-yellow-500 mb-2 transition-colors" />
                  <p className="text-sm text-gray-400 group-hover:text-yellow-500 transition-colors">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-xs text-gray-500 group-hover:text-yellow-600 transition-colors mt-1">
                    PNG, JPG, JPEG (MAX. 5MB)
                  </p>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => setFormData({ ...formData, imageFile: e.target.files[0] })}
                />
              </label>
            </div>

            {formData.imageFile && (
              <div className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg border border-gray-600">
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0 w-10 h-10 rounded bg-gray-600 overflow-hidden">
                    {formData.imageFile.type.startsWith("image/") && (
                      <img 
                        src={URL.createObjectURL(formData.imageFile)} 
                        alt="Preview" 
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-200 truncate">
                      {formData.imageFile.name}
                    </p>
                    <p className="text-xs text-gray-400">
                      {(formData.imageFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, imageFile: null })}
                  className="text-gray-400 hover:text-red-500 ml-2 transition-colors"
                  aria-label="Remove file"
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>
              </div>
            )}
          </div>

          {error && (
            <div className="p-3 bg-red-900/30 border border-red-700 rounded-lg text-red-400 text-sm">
              {error}
            </div>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 bg-gray-700 hover:bg-gray-600 text-gray-200 rounded-lg transition-colors duration-200"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-semibold rounded-lg transition-colors duration-200 disabled:opacity-70 flex items-center justify-center min-w-32"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-900" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Posting...
                </>
              ) : "Create Post"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePostModal;