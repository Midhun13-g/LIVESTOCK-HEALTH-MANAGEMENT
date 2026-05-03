import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { NotificationProvider } from "./contexts/NotificationContext";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header/header";
import Dashboard from "./components/Dashboard";
import AnimalPage from "./components/animals/AnimalPage";
import ReportsPage from "./components/ReportsPage";
import SettingsPage from "./components/Settings/SettingsPage";
import Register from "./components/Register";
import Login from "./components/Login";
import AIAssistant from "./components/AIAssistant";
import Profile from "./components/Header/Profile/Profile";
import Notifications from "./components/Header/Notification";
import Diseases from "./components/Disease/Disease";
import Diseaseform from "./components/Diseaseform";
import "./App.css";

const ProtectedRoute = ({ children }) => {
  const { isLoggedIn } = useAuth();
  return isLoggedIn ? children : <Navigate to="/login" />;
};

function AppRoutes() {
  const { isLoggedIn } = useAuth();
  return (
    <div className="app-container">
      {isLoggedIn && <Sidebar />}
      <div className="main-content">
        {isLoggedIn && <Header />}
        <Routes>
          <Route path="/" element={isLoggedIn ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} />
          <Route path="/login" element={isLoggedIn ? <Navigate to="/dashboard" /> : <Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard"    element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/animals"      element={<ProtectedRoute><AnimalPage /></ProtectedRoute>} />
          <Route path="/diseaseform"  element={<ProtectedRoute><Diseaseform /></ProtectedRoute>} />
          <Route path="/reports"      element={<ProtectedRoute><ReportsPage /></ProtectedRoute>} />
          <Route path="/settings"     element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
          <Route path="/ai-assistant" element={<ProtectedRoute><AIAssistant /></ProtectedRoute>} />
          <Route path="/profile"      element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/notification" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
          <Route path="/diseases"     element={<ProtectedRoute><Diseases /></ProtectedRoute>} />
        </Routes>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <NotificationProvider>
          <AppRoutes />
        </NotificationProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
