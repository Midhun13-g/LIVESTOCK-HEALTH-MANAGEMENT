import React from "react";
import "./AuthLayout.css";

const AuthLayout = ({ image, imageAlt, children }) => {
  return (
    <div className="auth-container">

      {/* Left — image */}
      <div className="auth-image-panel">
        <div className="auth-image-overlay" />
        <img src={image} alt={imageAlt} className="auth-image" />
        <div className="auth-image-badge">
          <span className="auth-image-badge-icon">🐾</span>
          <span className="auth-image-badge-text">LiveStock Health Management</span>
        </div>
      </div>

      {/* Right — form */}
      <div className="auth-form-panel">
        <div className="auth-form-card">
          {children}
        </div>
      </div>

    </div>
  );
};

export default AuthLayout;
