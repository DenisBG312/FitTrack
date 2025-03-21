import React, { useEffect, useState } from "react";
import { profile } from "../services/authService";

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

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-900">
        <div className="flex flex-col items-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-700 border-t-yellow-500"></div>
          <p className="mt-4 text-lg font-medium text-gray-300">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-900">
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
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 py-12">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-xl bg-gray-800 shadow">
          <div className="relative h-32 bg-gradient-to-r from-yellow-500 to-yellow-600">
            <div className="absolute -bottom-16 left-8">
              {userData?.profileImageUrl && !imageError ? (
                <img
                src={userData?.profileImageUrl}
                alt={`${userData.username}'s profile`}
                onError={handleImageError} 
                className="h-32 w-32 rounded-full border-4 border-gray-800 object-cover shadow-lg"
              />
              ) : (
                <div className="flex h-32 w-32 items-center justify-center rounded-full border-4 border-gray-800 bg-gray-700 text-4xl font-bold text-gray-300 shadow-lg">
                  {userData?.username?.charAt(0).toUpperCase() || "U"}
                </div>
              )}
            </div>
          </div>

          <div className="mt-16 px-8 pb-8 pt-4">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h1 className="text-3xl font-bold text-white">{userData?.username || "User"}</h1>
                <p className="mt-1 text-lg text-gray-400">
                  {userData?.role ? userData.role.charAt(0).toUpperCase() + userData.role.slice(1) : "Member"}
                </p>
              </div>
              <div className="mt-4 sm:mt-0">
                <button className="rounded-lg bg-yellow-500 px-4 py-2 font-medium text-gray-900 hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 focus:ring-offset-gray-800">
                  Edit Profile
                </button>
              </div>
            </div>

            <div className="mt-8 grid gap-6 sm:grid-cols-2">
              <div className="space-y-6 rounded-lg bg-gray-700 p-6 shadow-sm">
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
              </div>

              <div className="space-y-6 rounded-lg bg-gray-700 p-6 shadow-sm">
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
              </div>
            </div>

            <div className="mt-8 flex justify-center">
              <div className="inline-flex rounded-md" role="group">
                <button className="rounded-l-lg border border-gray-600 bg-gray-700 px-4 py-2 text-sm font-medium text-gray-300 hover:bg-gray-600 focus:z-10 focus:outline-none focus:ring-2 focus:ring-yellow-500">
                  Workout History
                </button>
                <button className="border-b border-t border-gray-600 bg-gray-700 px-4 py-2 text-sm font-medium text-gray-300 hover:bg-gray-600 focus:z-10 focus:outline-none focus:ring-2 focus:ring-yellow-500">
                  Nutrition Log
                </button>
                <button className="rounded-r-lg border border-gray-600 bg-gray-700 px-4 py-2 text-sm font-medium text-gray-300 hover:bg-gray-600 focus:z-10 focus:outline-none focus:ring-2 focus:ring-yellow-500">
                  Body Metrics
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;