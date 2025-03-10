import React, { useEffect } from "react";
import { useAuth } from "../AuthContext"; // Ensure this provides user info
import { useNavigate } from "react-router-dom";

const UserDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;

    const userRoles = Array.isArray(user.role) ? user.role : [];

    if (userRoles.includes("ADMIN")) {
      navigate("/admin-dashboard");
    } else if (userRoles.includes("USER")) {
      navigate("/user-dashboard");
    } else {
      navigate("/access-denied");
    }
  }, [user, navigate]); // Run when user changes

  return <h1>Loading...</h1>; // Show loading while redirecting
};

export default UserDashboard;
