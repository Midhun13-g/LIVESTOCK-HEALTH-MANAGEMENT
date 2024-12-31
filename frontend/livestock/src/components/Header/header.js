import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { Search, Bell, User } from "lucide-react";
import "./header.css";

function Header() {
  const navigate = useNavigate(); // Initialize the navigation hook
  const [searchQuery, setSearchQuery] = useState(""); // State to store search input
  const [showOverlay, setShowOverlay] = useState(false); // State to toggle overlay

  // Toggle the profile overlay
  const handleProfileClick = () => {
    setShowOverlay(!showOverlay);
  };

  // Navigate to the Notifications page
  const handleNotificationClick = () => {
    navigate("/Notification");
  };

  // Handle search bar action
  const handleSearch = (event) => {
    event.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?query=${encodeURIComponent(searchQuery)}`); // Pass search query as URL parameter
    }
  };

  return (
    <header className="header">
      <form className="search-container" onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Search..."
          className="search-input"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button type="submit" className="search-icon-button">
          <Search className="search-icon" />
        </button>
      </form>
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
            <li onClick={() => navigate("/signout")}>Sign Out</li>
          </ul>
        </div>
      )}
    </header>
  );
}

export default Header;
