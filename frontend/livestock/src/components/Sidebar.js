import React from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import "./Sidebar.css";

const NAV = [
  { to: "/dashboard",   icon: "🏠", label: "Dashboard" },
  { to: "/animals",     icon: "🐄", label: "Animals" },
  { to: "/diseaseform", icon: "🔬", label: "Disease Prediction" },
  { to: "/diseases",    icon: "📖", label: "Disease Guide" },
  { to: "/reports",     icon: "📊", label: "Reports" },
  { to: "/ai-assistant",icon: "🤖", label: "AI Assistant" },
  { to: "/settings",    icon: "⚙️", label: "Settings" },
];

function Sidebar() {
  const { logout } = useAuth();
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <span className="sidebar-brand-icon">🐾</span>
        <span className="sidebar-brand-text">LiveStock</span>
      </div>
      <nav className="sidebar-nav">
        {NAV.map(({ to, icon, label }) => (
          <NavLink key={to} to={to} className={({ isActive }) => `sidebar-link${isActive ? " active" : ""}`}>
            <span className="sidebar-link-icon">{icon}</span>
            <span className="sidebar-link-label">{label}</span>
          </NavLink>
        ))}
      </nav>
      <button className="sidebar-logout" onClick={logout}>
        <span>🚪</span> Logout
      </button>
    </aside>
  );
}

export default Sidebar;
