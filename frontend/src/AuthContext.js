import React, { createContext, useEffect, useState } from "react";
import api from "./api";

export const AuthContext = createContext({
  user: null,
  loading: true,
  error: null,
  message: null,
  login: async () => {},
  logout: async () => {},
  register: async () => {},
  clearMessage: () => {},
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  const fetchCurrentUser = async () => {
    try {
      const response = await api.get("/auth/me");
      setUser(response.data.user);
    } catch (err) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  const clearMessage = () => {
    setError(null);
    setMessage(null);
  };

  const register = async (email, password) => {
    try {
      clearMessage();
      const response = await api.post("/auth/register", { email, password });
      setUser(response.data.user);
      const username =
        response.data.user.email?.split("@")[0] || response.data.user.email;
      setMessage(`Welcome, ${username}!`);
      return response.data;
    } catch (err) {
      console.error("Auth register error", err?.response || err.message || err);
      const text =
        err?.response?.data?.message || err?.message || "Registration failed.";
      setError(text);
      throw err;
    }
  };

  const login = async (email, password) => {
    try {
      clearMessage();
      const response = await api.post("/auth/login", { email, password });
      setUser(response.data.user);
      const username =
        response.data.user.email?.split("@")[0] || response.data.user.email;
      setMessage(`Welcome, ${username}!`);
      return response.data;
    } catch (err) {
      console.error("Auth login error", err?.response || err.message || err);
      const text =
        err?.response?.data?.message || err?.message || "Login failed.";
      setError(text);
      throw err;
    }
  };

  const logout = async () => {
    try {
      clearMessage();
      await api.post("/auth/logout");
      setUser(null);
      setMessage("You have been logged out.");
    } catch (err) {
      setError("Unable to logout.");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        message,
        login,
        logout,
        register,
        clearMessage,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
