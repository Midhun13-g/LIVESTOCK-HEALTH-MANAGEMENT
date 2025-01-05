import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import {Bell, User } from "lucide-react";
import "./header.css";

function Header() {
  const navigate = useNavigate(); // Initialize the navigation hook
  
  const [showOverlay, setShowOverlay] = useState(false); // State to toggle overlay

  // Toggle the profile overlay
  const handleProfileClick = () => {
    setShowOverlay(!showOverlay);
  };

  // Navigate to the Notifications page
  const handleNotificationClick = (event) => {
    event.preventDefault(); // Prevent any default action on click
    console.log("Navigating to Notifications...");
    navigate("/Notification"); // Use navigate to go to the Notifications page
  };

  

  // Handle Sign Out
  const handleLogout = () => {
    // Clear session or token storage
    alert("Logged out successfully!");
    navigate("/register"); // Redirect to the register page
  };

  return (
    <header className="header">
      
      <div className="header-right">
        <Bell
          className="icon"
          onClick={handleNotificationClick}
          style={{ cursor: "pointer" }}
        />
        <div className="profile" onClick={handleProfileClick} style={{ cursor: "pointer" }}>
          <User className="icon" />
          <span className="profile-text">Profile</span>
        </div>
      </div>
      {showOverlay && (
        <div className="profile-overlay">
          <ul className="profile-overlay-menu">
            <li onClick={() => navigate("/Profile")}>Your Profile</li>
            <li onClick={() => navigate("/Notification")}>Notifications</li>
            <li onClick={() => navigate("/settings")}>Settings</li>
            <li onClick={handleLogout}>Sign Out</li>
          </ul>
        </div>
      )}
    </header>
  );
}

export default Header;
