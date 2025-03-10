import React from "react";
import { useAuth } from "../AuthContext";

const AdminDashboard = () => {
  const { user } = useAuth();

  if (!user || !Array.isArray(user.role) || !user.role.includes("ADMIN"))  {
    return <h1>Access Denied !!!</h1>;
  }

  return <h1>Welcome, Admin!</h1>;
};

export default AdminDashboard;
