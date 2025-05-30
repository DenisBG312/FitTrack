import React, { useState, useEffect } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import Profile from "./components/Profile";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./components/Home";
import NavBar from "./components/NavBar";
import { checkAuth, logout } from "./services/authService";
import Workouts from "./components/WorkoutComponents/Workouts";
import WorkoutDetails from "./components/WorkoutComponents/WorkoutDetails";
import Nutritions from "./components/NutritionComponents/Nutritions";
import SocialFeed from "./components/SocialMediaComponents/SocialFeed";
import PostDetails from "./components/SocialMediaComponents/PostDetails";
import GymList from "./components/GymList";

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAuthStatus = async () => {
      try {
        const userData = await checkAuth();
        setIsAuthenticated(true);
        setUsername(userData.username);
      } catch (error) {
        setIsAuthenticated(false);
        console.log(error);
      }
    };

    fetchAuthStatus();
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      setIsAuthenticated(false);
      setUsername("");
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className="bg-gray-900 min-h-screen text-white" style={{ paddingTop: "80px" }}>
      <NavBar isAuthenticated={isAuthenticated} username={username} handleLogout={handleLogout} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} setUsername={setUsername} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<ProtectedRoute element={<Profile />} />} />
        <Route path="/workouts" element={<Workouts />} />
        <Route path="/workouts/:id" element={<WorkoutDetails />} />
        <Route path="/community" element={<SocialFeed />} />
        <Route path="/nutritions" element={<ProtectedRoute element={<Nutritions />} />} />
        <Route path="/posts/:postId" element={<PostDetails />} />
        <Route path="/gyms" element={<ProtectedRoute element={<GymList />} />} />
      </Routes>
    </div>
  );
};

export default App;
