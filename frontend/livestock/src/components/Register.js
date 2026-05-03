import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AuthLayout from "./AuthLayout";
import "./AuthLayout.css";

const Register = () => {
  const [showPassword, setShowPassword]               = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError]                             = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    const formData        = new FormData(e.target);
    const username        = formData.get("username");
    const email           = formData.get("email");
    const password        = formData.get("password");
    const confirmPassword = formData.get("confirmPassword");

    if (password !== confirmPassword) {
      setError("Passwords do not match. Please try again.");
      return;
    }
    try {
      await axios.post("http://127.0.0.1:8000/register", {
        username,
        email,
        hashed_password: password,
      });
      navigate("/login");
    } catch (err) {
      setError(err?.response?.data?.detail || "Failed to register. Please try again.");
    }
  };

  return (
    <AuthLayout
      image="https://www.aiplusinfo.com/wp-content/uploads/2024/12/AI-in-Livestock-Management-1536x878.jpeg.webp"
      imageAlt="AI Livestock Monitoring"
    >
      {/* Brand */}
      <div className="auth-brand">
        <div className="auth-brand-icon">🐾</div>
        <span className="auth-brand-name">LiveStock</span>
      </div>

      <h1 className="auth-title">Create an account</h1>
      <p className="auth-subtitle">Start managing your livestock health today.</p>

      <form className="auth-form" onSubmit={handleRegister}>
        <div className="auth-field">
          <label className="auth-label">Username</label>
          <input
            className="auth-input"
            type="text"
            name="username"
            placeholder="Enter your username"
            required
          />
        </div>

        <div className="auth-field">
          <label className="auth-label">Email Address</label>
          <input
            className="auth-input"
            type="email"
            name="email"
            placeholder="Enter your email"
            required
          />
        </div>

        <div className="auth-field">
          <label className="auth-label">Password</label>
          <input
            className="auth-input"
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Create a password"
            required
          />
          <span className="auth-eye" onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? "👁️" : "👁️🗨️"}
          </span>
        </div>

        <div className="auth-field">
          <label className="auth-label">Confirm Password</label>
          <input
            className="auth-input"
            type={showConfirmPassword ? "text" : "password"}
            name="confirmPassword"
            placeholder="Confirm your password"
            required
          />
          <span className="auth-eye" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
            {showConfirmPassword ? "👁️" : "👁️🗨️"}
          </span>
        </div>

        {error && <p className="auth-error">{error}</p>}

        <button type="submit" className="auth-btn">Create Account</button>
      </form>

      <p className="auth-footer">
        Already have an account?{" "}
        <span className="auth-link" onClick={() => navigate("/login")}>
          Log in
        </span>
      </p>
    </AuthLayout>
  );
};

export default Register;
