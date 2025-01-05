import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
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
import { NotificationProvider } from "./contexts/NotificationContext";  // Import the NotificationProvider
import "./App.css";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // A function to handle successful login
  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  return (
    <NotificationProvider> {/* Wrap the app with NotificationProvider */}
      <Router>
        <div className="app-container">
          {isLoggedIn && <Sidebar />}  {/* Show Sidebar only if logged in */}
          <div className="main-content">
            {isLoggedIn && <Header />}  {/* Show Header only if logged in */}
            
            <Routes>
              {/* Redirect to Login if not logged in */}
              <Route
                path="/"
                element={isLoggedIn ? <Navigate to="/dashboard" /> : <Login onLogin={handleLogin} />}
              />
              <Route
                path="/login"
                element={isLoggedIn ? <Navigate to="/dashboard" /> : <Login onLogin={handleLogin} />}
              />
              <Route path="/register" element={<Register />} />
              <Route
                path="/dashboard"
                element={isLoggedIn ? <Dashboard /> : <Navigate to="/login" />}
              />
              <Route
                path="/animals"
                element={isLoggedIn ? <AnimalPage /> : <Navigate to="/login" />}
              />
              <Route
              path="/diseaseform"
              element={isLoggedIn ? <Diseaseform /> : <Navigate to="/login" />}
            />
              
              <Route
                path="/reports"
                element={isLoggedIn ? <ReportsPage /> : <Navigate to="/login" />}
              />
              <Route
                path="/settings"
                element={isLoggedIn ? <SettingsPage /> : <Navigate to="/login" />}
              />
              <Route
                path="/ai-assistant"
                element={isLoggedIn ? <AIAssistant /> : <Navigate to="/login" />}
              />
              <Route
                path="/profile"
                element={isLoggedIn ? <Profile /> : <Navigate to="/login" />}
              />
              <Route
                path="/notification"
                element={isLoggedIn ? <Notifications /> : <Navigate to="/login" />}
              />
              <Route
                path="/diseases"
                element={isLoggedIn ? <Diseases /> : <Navigate to="/login" />}
              />
              
            </Routes>
          </div>
        </div>
      </Router>
    </NotificationProvider> 
  );
}

export default App;
