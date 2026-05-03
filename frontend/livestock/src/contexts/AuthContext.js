import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setUsername("");
    navigate("/login");
  }, [navigate]);

  // Check token on mount and set auto-logout timer
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const expiresAt = payload.exp * 1000;
      if (Date.now() >= expiresAt) {
        logout();
        return;
      }
      setIsLoggedIn(true);
      setUsername(payload.sub);
      // Auto logout when token expires
      const timeout = setTimeout(logout, expiresAt - Date.now());
      return () => clearTimeout(timeout);
    } catch {
      logout();
    }
  }, [logout]);

  const login = (token) => {
    localStorage.setItem("token", token);
    const payload = JSON.parse(atob(token.split(".")[1]));
    setIsLoggedIn(true);
    setUsername(payload.sub);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, username, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
