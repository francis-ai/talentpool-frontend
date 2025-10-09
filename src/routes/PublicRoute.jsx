// src/routes/PublicRoute.jsx
import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const PublicRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) return null; // wait until finished checking

  // If already logged in → go to dashboard
  if (user) {
    return <Navigate to="/student-dashboard" replace />;
  }

  return children;
};

export default PublicRoute;
