import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Footer from "./Footer";

const Login = ({ setIsAuthenticated, setUsername }) => {
  const API_URL = import.meta.env.VITE_PUBLIC_API_URL;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/auth/login`, { email, password }, { withCredentials: true });
      setIsAuthenticated(true);
      const response = await axios.get(`${API_URL}/auth/profile`, { withCredentials: true });
      setUsername(response.data.username);
      navigate("/profile");
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      {/* Main content area: Centered login form */}
      <div className="flex-grow flex items-center justify-center">
        <div className="w-full max-w-md bg-gray-800 p-8 rounded-lg shadow-lg">
          <h2 className="text-3xl font-bold text-white text-center mb-6">Login</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
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
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 bg-gray-700 text-white rounded-md focus:ring-2 focus:ring-yellow-500 outline-none"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-bold py-3 rounded-md transition-all"
            >
              Login
            </button>
          </form>
          <p className="text-gray-400 text-center mt-4">
            Don't have an account?{" "}
            <a href="/register" className="text-yellow-500 hover:underline">
              Register
            </a>
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Login;