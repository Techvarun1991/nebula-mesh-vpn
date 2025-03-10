import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode"; // Install this package using `npm install jwt-decode`

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);

  useEffect(() => {
    if (token) {
      fetchUserProfile();
    }
  }, [token]);

  const fetchUserProfile = () => {
    if (!token) return;

    try {
      const decoded = jwtDecode(token);
      setUser({
        name: decoded.name,
        email: decoded.email,
        username: decoded.preferred_username,
        userId: decoded.sub,
        role: decoded.role || [],  // Ensure role is an array
      });
    } catch (error) {
      console.error("Failed to decode token", error);
      logout();
    }
  };

  const login = async (credentials) => {
    try {
      const response = await axios.post("http://192.168.10.109:5000/login", credentials);
      // console.log("Response: ", response.data);
      const { access_token, id_token } = response.data;

      localStorage.setItem("token", access_token);
      setToken(access_token);

      if (id_token) {
        const decoded = jwtDecode(id_token);
        console.log("Decoded: ", decoded);
        setUser({
          name: decoded.given_name + " " + decoded.family_name,
          email: decoded.email,
          username: decoded.preferred_username,
          userId: decoded.sub,
          role: decoded.role || [],  // Ensure role is an array
        });
        // console.log("Assigned Roles:", decoded.role);
      }
      return true;
    } catch (error) {
      console.error("Login failed", error);
      return false;
    }
  };

  const logout = async () => {
    try {
      await axios.post(
        `http://192.168.10.109:5000/logout/${user.user_id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (error) {
      console.error("Logout failed", error);
    } finally {
      localStorage.removeItem("token");
      setToken(null);
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => React.useContext(AuthContext);
