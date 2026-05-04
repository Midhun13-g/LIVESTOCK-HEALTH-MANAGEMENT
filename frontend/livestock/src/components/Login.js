import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import AuthLayout from "./AuthLayout";
import api from "../api";
import "./AuthLayout.css";

const Login = () => {
  const [error, setError]               = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    const username = e.target.username.value;
    const password = e.target.password.value;
    try {
      const formData = new URLSearchParams();
      formData.append("username", username);
      formData.append("password", password);
      const res = await api.post("/token", formData, {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      });
      login(res.data.access_token);
      navigate("/dashboard");
    } catch (err) {
      if      (err.response?.status === 422) setError("Invalid username or password.");
      else if (err.response?.status === 404) setError("User not found. Please register first.");
      else if (err.response?.status === 401) setError("Incorrect password. Please try again.");
      else if (err.response)                 setError("Something went wrong. Please try again.");
      else                                   setError("Network error. Please try again later.");
    }
  };

  return (
    <AuthLayout
      image="https://connected-vet.com/wp-content/uploads/2023/10/iclassifier.png"
      imageAlt="Livestock management"
    >
      {/* Brand */}
      <div className="auth-brand">
        <div className="auth-brand-icon">🐾</div>
        <span className="auth-brand-name">LiveStock</span>
      </div>

      <h1 className="auth-title">Welcome back</h1>
      <p className="auth-subtitle">Sign in to your account to continue.</p>

      <form className="auth-form" onSubmit={handleLogin}>
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
          <label className="auth-label">Password</label>
          <input
            className="auth-input"
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Enter your password"
            required
          />
          <span className="auth-eye" onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? "👁️" : "👁️🗨️"}
          </span>
        </div>

        {error && <p className="auth-error">{error}</p>}

        <button type="submit" className="auth-btn">Sign In</button>
      </form>

      <p className="auth-footer">
        Don't have an account?{" "}
        <span className="auth-link" onClick={() => navigate("/register")}>
          Sign up for free
        </span>
      </p>
    </AuthLayout>
  );
};

export default Login;
