import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { profile } from "../services/authService";
import LoadingSpinner from "./LoadingSpinner";

const ProtectedRoute = ({ element }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        await profile();
        setIsAuthenticated(true);
      } catch (error) {
        setIsAuthenticated(false);
      }
    };

    verifyAuth();
  }, []);

  if (isAuthenticated === null) {
    return <LoadingSpinner />;
  }

  return isAuthenticated ? element : <Navigate to="/login" replace />;
};

export default ProtectedRoute;