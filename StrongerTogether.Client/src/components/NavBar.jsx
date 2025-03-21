import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { AiOutlineHome, AiOutlineLogin, AiOutlineUserAdd } from "react-icons/ai";
import { FaUser, FaSignOutAlt, FaDumbbell } from "react-icons/fa";

const NavBar = ({ isAuthenticated, username, handleLogout }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Add scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={`${scrolled ? "bg-gray-900 shadow-lg" : "bg-gradient-to-r from-gray-900 to-gray-800"} text-white fixed top-0 left-0 z-50 w-full transition-all duration-300 ${scrolled ? "h-16" : "h-20"}`}>
      <div className="container mx-auto px-6 h-full flex justify-between items-center">
        
        {/* Logo with Animation */}
        <Link 
          to="/" 
          className="text-2xl font-bold flex items-center gap-2 transition-all duration-300 transform hover:scale-105"
        >
          <FaDumbbell className="text-yellow-500" size={26} />
          <span className="bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent font-extrabold uppercase tracking-wider">
            FitTrack
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex md:items-center md:space-x-8">
          <Link 
            to="/" 
            className="relative group flex items-center gap-2 font-medium text-gray-200 hover:text-white"
          >
            <AiOutlineHome size={20} className="text-yellow-500 group-hover:animate-pulse" /> 
            <span>Home</span>
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-yellow-500 transition-all duration-300 group-hover:w-full"></span>
          </Link>

          {isAuthenticated ? (
            <>
              <Link 
                to="/profile" 
                className="relative group flex items-center gap-2 font-medium text-gray-200 hover:text-white"
              >
                <FaUser size={18} className="text-yellow-500 group-hover:animate-pulse" /> 
                <span>Profile</span>
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-yellow-500 transition-all duration-300 group-hover:w-full"></span>
              </Link>
              
              <div className="px-4 py-1 rounded-full bg-gray-800 bg-opacity-50 flex items-center">
                <span className="text-gray-300 text-sm mr-2">Welcome,</span>
                <span className="font-semibold text-yellow-400">{username}</span>
              </div>
              
              <button
                onClick={handleLogout}
                className="px-5 py-2 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-gray-900 font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-300 flex items-center gap-2 transform hover:-translate-y-0.5"
              >
                <FaSignOutAlt size={18} /> Logout
              </button>
            </>
          ) : (
            <>
              <Link 
                to="/login" 
                className="relative group flex items-center gap-2 font-medium text-gray-200 hover:text-white"
              >
                <AiOutlineLogin size={20} className="text-yellow-500 group-hover:animate-pulse" /> 
                <span>Login</span>
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-yellow-500 transition-all duration-300 group-hover:w-full"></span>
              </Link>
              
              <Link 
                to="/register" 
                className="px-5 py-2 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-gray-900 font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-300 flex items-center gap-2 transform hover:-translate-y-0.5"
              >
                <AiOutlineUserAdd size={18} /> Register
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden flex items-center px-3 py-2 rounded-lg bg-gray-800 hover:bg-yellow-500 text-yellow-500 hover:text-gray-900 transition-colors duration-300"
          aria-label="Toggle menu"
        >
          <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            {mobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16m-7 6h7" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Navigation */}
      <div 
        className={`md:hidden transition-all duration-300 overflow-hidden ${
          mobileMenuOpen ? "max-h-64 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="flex flex-col space-y-4 px-6 py-4 bg-gray-800 border-t border-gray-700">
          <Link 
            to="/" 
            className="flex items-center gap-2 py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors duration-200"
            onClick={() => setMobileMenuOpen(false)}
          >
            <AiOutlineHome size={20} className="text-yellow-500" /> Home
          </Link>

          {isAuthenticated ? (
            <>
              <Link 
                to="/profile" 
                className="flex items-center gap-2 py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors duration-200"
                onClick={() => setMobileMenuOpen(false)}
              >
                <FaUser size={18} className="text-yellow-500" /> Profile
              </Link>
              
              <div className="py-2 px-4 bg-gray-700 bg-opacity-50 rounded-lg">
                <span className="text-gray-300 text-sm">Logged in as </span>
                <span className="font-semibold text-yellow-400">{username}</span>
              </div>
              
              <button
                onClick={() => {
                  handleLogout();
                  setMobileMenuOpen(false);
                }}
                className="py-2 px-4 bg-gradient-to-r from-yellow-500 to-yellow-600 text-gray-900 font-semibold rounded-lg flex items-center gap-2 justify-center"
              >
                <FaSignOutAlt size={18} /> Logout
              </button>
            </>
          ) : (
            <>
              <Link 
                to="/login" 
                className="flex items-center gap-2 py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors duration-200"
                onClick={() => setMobileMenuOpen(false)}
              >
                <AiOutlineLogin size={20} className="text-yellow-500" /> Login
              </Link>
              
              <Link 
                to="/register" 
                className="py-2 px-4 bg-gradient-to-r from-yellow-500 to-yellow-600 text-gray-900 font-semibold rounded-lg flex items-center gap-2 justify-center"
                onClick={() => setMobileMenuOpen(false)}
              >
                <AiOutlineUserAdd size={18} /> Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavBar;