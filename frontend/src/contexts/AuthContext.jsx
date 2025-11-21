import React, { createContext, useContext, useState, useEffect } from "react";
import ApiService from "../services/api";

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (token && storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    try {
      const response = await ApiService.login(username, password);
      // Normalize response: backend returns { token, username, role }
      const userObj = response.user
        ? response.user
        : response.username
        ? { username: response.username, role: response.role }
        : null;

      if (response.token) localStorage.setItem("token", response.token);
      if (userObj) {
        localStorage.setItem("user", JSON.stringify(userObj));
        setUser(userObj);
      }

      return { ...response, user: userObj };
    } catch (error) {
      throw error;
    }
  };

  const register = async (username, email, password) => {
    try {
      const response = await ApiService.register({ username, email, password });
      return response;
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  const isAdmin = () => user?.role === "admin";
  const isAgent = () => user?.role === "agent";
  const isUser = () => user?.role === "user";

  const value = {
    user,
    login,
    register,
    logout,
    isAuthenticated: !!user,
    isAdmin,
    isAgent,
    isUser,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
