import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import Login from "./pages/Login";
import UserDashboard from "./pages/UserDashboard";

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" />;
  
  return children;
};

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <UserDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
