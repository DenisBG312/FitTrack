import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Footer from "./Footer";
import LoadingSpinner from "./LoadingSpinner";

const Register = () => {
  const API_URL = import.meta.env.VITE_PUBLIC_API_URL;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(null);

    if (!profileImage) {
      setError("Please upload a profile image.");
      return;
    }

    const formData = new FormData();
    formData.append("email", email);
    formData.append("password", password);
    formData.append("username", username);
    formData.append("height", height);
    formData.append("weight", weight);
    formData.append("profileImage", profileImage);

    setIsLoading(true);
    try {
      await axios.post(`${API_URL}/auth/register`, formData, {
        withCredentials: true,
      });
      navigate("/login");
    } catch (err) {
      console.error("Registration failed:", err);
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col pt-10">
      <div className="flex-grow flex items-center justify-center pb-10">
        <div className="w-full max-w-md bg-gray-800 p-8 rounded-lg shadow-lg">
          <h2 className="text-3xl font-bold text-white text-center mb-6">Register</h2>

          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 bg-gray-700 text-white rounded-md focus:ring-2 focus:ring-yellow-500 outline-none"
                required
              />
            </div>

            <div>
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full p-3 bg-gray-700 text-white rounded-md focus:ring-2 focus:ring-yellow-500 outline-none"
                required
              />
            </div>

            <div>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 bg-gray-700 text-white rounded-md focus:ring-2 focus:ring-yellow-500 outline-none"
                required
              />
            </div>

            <div>
              <input
                type="number"
                placeholder="Height (cm)"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                className="w-full p-3 bg-gray-700 text-white rounded-md focus:ring-2 focus:ring-yellow-500 outline-none"
                required
              />
            </div>

            <div>
              <input
                type="number"
                placeholder="Weight (kg)"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="w-full p-3 bg-gray-700 text-white rounded-md focus:ring-2 focus:ring-yellow-500 outline-none"
                required
              />
            </div>

            <div>
              <input
                type="file"
                onChange={(e) => setProfileImage(e.target.files[0])}
                className="w-full p-3 bg-gray-700 text-white rounded-md focus:ring-2 focus:ring-yellow-500 outline-none"
              />
            </div>

            {error && <p className="text-red-500 text-center">{error}</p>}

            {isLoading ? (
              <LoadingSpinner />
            ) : (
              <button
                type="submit"
                className="w-full bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-bold py-3 rounded-md transition-all"
              >
                Register
              </button>
            )}
          </form>

          <p className="text-gray-400 text-center mt-4">
            Already have an account?{" "}
            <a href="/login" className="text-yellow-500 hover:underline">
              Login
            </a>
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Register;
