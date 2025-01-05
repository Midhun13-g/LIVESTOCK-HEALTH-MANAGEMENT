import React from "react";
import { NavLink } from "react-router-dom"; // Using NavLink
import "./Sidebar.css";

function Sidebar() {
  return (
    <div className="sidebar">
      
      <h2 className="sidebar-title">LiveStock Manager</h2>
      <nav>
        <ul className="sidebar-nav">
          <li>
            <NavLink to="/dashboard" className="sidebar-link" activeClassName="active">
            Dashboard
            </NavLink>
          </li>
          <li>
            <NavLink to="/animals" className="sidebar-link" activeClassName="active">
              Animals
            </NavLink>
          </li>
          
          <li>
            <NavLink to="/reports" className="sidebar-link" activeClassName="active">
              Reports
            </NavLink>
          </li>
          
          <li>
            <NavLink to="/ai-assistant" className="sidebar-link" activeClassName="active">
               AI Assistant
            </NavLink>
          </li>
          <li>
            <NavLink to="/diseaseform" className="sidebar-link" activeClassName="active">
               Disease Prediction
            </NavLink>
          </li>
          <li>
            <NavLink to="/diseases" className="sidebar-link" activeClassName="active">
               Disease Guide
            </NavLink>
          </li>
          
          <li>
            <NavLink to="/settings" className="sidebar-link" activeClassName="active">
             Settings
            </NavLink>
          </li>

        </ul>
      </nav>
    </div>
  );
}

export default Sidebar;
