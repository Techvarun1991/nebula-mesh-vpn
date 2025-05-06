// import React from "react";
// import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
// import { useAuth } from "./AuthContext";
// import Login from "./pages/Login";
// import Dashboard from "./pages/Dashboard";

// const ProtectedRoute = ({ children }) => {
//   const { user } = useAuth();

//   if (!user) return <Navigate to="/login" />;
  
//   return children;
// };

// const AppRoutes = () => {
//   return (
//     <Router>
//       <Routes>
//         <Route path="/login" element={<Login />} />
//         <Route
//           path="/dashboard"
//           element={
//             <ProtectedRoute>
//               <Dashboard />
//             </ProtectedRoute>
//           }
//         />
//       </Routes>
//     </Router>
//   );
// };

// export default AppRoutes;

import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";
import UserDashboard from "./pages/UserDashboard";
import AccessDenied from "./pages/AccessDenied";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" />;

  const userRoles = Array.isArray(user.role) ? user.role : [];

  if (!allowedRoles.some(role => userRoles.includes(role))) {
    return <Navigate to="/access-denied" />;
  }

  return children;
};

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/access-denied" element={<AccessDenied />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user-dashboard"
          element={
            <ProtectedRoute allowedRoles={["USER"]}>
              <UserDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
