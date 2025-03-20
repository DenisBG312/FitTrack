import React from "react";
import { Link } from "react-router-dom";

const NavBar = ({ isAuthenticated, username, handleLogout }) => {
  return (
    <nav className="bg-gray-900 text-white shadow-lg w-full fixed top-0 left-0 z-50 h-20">
      <div className="container mx-auto px-6 h-full py-4 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-yellow-500 uppercase tracking-wider">
          FitTrack
        </Link>

        {/* Links */}
        <div className="flex space-x-6">
          <Link to="/" className="hover:text-yellow-500 transition">Home</Link>
          {isAuthenticated ? (
            <>
              <Link to="/profile" className="hover:text-yellow-500 transition">Profile</Link>
              <span className="text-gray-300">| Welcome, {username}!</span>
              <button
                onClick={handleLogout}
                className="ml-4 px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-semibold rounded transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-yellow-500 transition">Login</Link>
              <Link to="/register" className="hover:text-yellow-500 transition">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavBar;