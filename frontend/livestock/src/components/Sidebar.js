import React, { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import "./Sidebar.css";

const NAV = [
  { to: "/dashboard",    icon: "🏠", label: "Dashboard" },
  { to: "/animals",      icon: "🐄", label: "Animals" },
  { to: "/diseaseform",  icon: "🔬", label: "Disease Prediction" },
  { to: "/diseases",     icon: "📖", label: "Disease Guide" },
  { to: "/reports",      icon: "📊", label: "Reports" },
  { to: "/ai-assistant", icon: "🤖", label: "AI Assistant" },
  { to: "/settings",     icon: "⚙️", label: "Settings" },
];

function Sidebar({ isOpen, onClose }) {
  const { logout } = useAuth();
  const location = useLocation();

  // Close sidebar on route change (mobile)
  useEffect(() => { onClose(); }, [location.pathname]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      {/* Overlay — mobile only */}
      {isOpen && <div className="sidebar-overlay" onClick={onClose} />}

      <aside className={`sidebar ${isOpen ? "sidebar-open" : ""}`}>
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
    </>
  );
}

export default Sidebar;
