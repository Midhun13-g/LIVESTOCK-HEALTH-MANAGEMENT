import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Bell, User } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { useNotificationContext } from "../../contexts/NotificationContext";
import "./header.css";

const PAGE_TITLES = {
  "/dashboard": "Dashboard", "/animals": "Animals",
  "/diseaseform": "Disease Prediction", "/diseases": "Disease Guide",
  "/reports": "Reports", "/ai-assistant": "AI Assistant",
  "/settings": "Settings", "/notification": "Notifications", "/profile": "Profile",
};

function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const { username, logout } = useAuth();
  const [showMenu, setShowMenu] = useState(false);
  const title = PAGE_TITLES[location.pathname] || "Livestock Manager";
  const { unreadCount } = useNotificationContext();

  return (
    <header className="header">
      <div className="header-left">
        <h1 className="header-title">{title}</h1>
      </div>
      <div className="header-right">
        <button className="header-icon-btn notif-btn" onClick={() => navigate("/notification")} title="Notifications">
          <Bell size={20} />
          {unreadCount > 0 && <span className="notif-badge">{unreadCount > 99 ? '99+' : unreadCount}</span>}
        </button>
        <div className="header-profile" onClick={() => setShowMenu(!showMenu)}>
          <div className="header-avatar">{username ? username[0].toUpperCase() : "U"}</div>
          <span className="header-username">{username}</span>
        </div>
        {showMenu && (
          <div className="header-dropdown">
            <div className="header-dropdown-user">
              <div className="header-avatar lg">{username ? username[0].toUpperCase() : "U"}</div>
              <span>{username}</span>
            </div>
            <hr />
            <button onClick={() => { navigate("/profile"); setShowMenu(false); }}><User size={14} /> Profile</button>
            <button onClick={() => { navigate("/notification"); setShowMenu(false); }}><Bell size={14} /> Notifications</button>
            <button onClick={() => { navigate("/settings"); setShowMenu(false); }}>⚙️ Settings</button>
            <hr />
            <button className="logout-btn" onClick={logout}>🚪 Sign Out</button>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;
