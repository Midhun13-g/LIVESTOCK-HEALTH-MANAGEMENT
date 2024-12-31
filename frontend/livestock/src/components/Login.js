import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Login.css";

const Login = ({ onLogin }) => {
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    const username = e.target.username.value;
    const password = e.target.password.value;

    try {
      // Prepare form data for the request
      const formData = new URLSearchParams();
      formData.append("username", username);
      formData.append("password", password);

      // Send POST request to login
      const response = await axios.post("http://127.0.0.1:8000/token", formData, {
        headers: { "Content-Type": "application/x-www-form-urlencoded" }
      });

      console.log(response.data);

      // Store the access token in localStorage (if needed)
      localStorage.setItem('token', response.data.access_token);

      // Show success message and redirect
      alert("Login successful!");
      onLogin();
      navigate("/dashboard");
    } catch (error) {
      // Handle errors based on the response status
      if (error.response) {
        if (error.response.status === 422) {
          setError("Invalid username or password. Please check your details.");
        } else if (error.response.status === 404) {
          setError("User not found. Please register first.");
        } else if (error.response.status === 401) {
          setError("Incorrect password. Please try again.");
        } else {
          setError("Something went wrong. Please try again.");
        }
      } else {
        setError("Network error. Please try again later.");
      }
    }
  };

  return (
    <div className="login-container">
      <div className="login-left">
        <h1>WELCOME BACK</h1>
        <p>Welcome back! Please enter your details.</p>
        <form className="login-form" onSubmit={handleLogin}>
          <div className="form-group">
            <div className="text">
              Username
            </div>
            <input
              type="text"
              className="form-control"
              placeholder="Enter your username"
              name="username"
              required
            />
          </div>
          <div className="text1">
              Password
          </div>
          <div className="form-group">
            <input
              type={showPassword ? "text" : "password"}
              className="form-control"
              placeholder="Enter your password"
              name="password"
              required
            />
            <span
              className="toggle-password"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "👁️" : "👁️‍🗨️"}
            </span>
          </div>
          <button type="submit" className="btn-primary">Sign in</button>
        </form>
        <p className="register-link">
          Don't have an account? <span onClick={() => navigate("/register")}>Sign up for free!</span>
        </p>
        {error && <div className="alert">{error}</div>}
      </div>
      <div className="login-right">
        <img
          src="https://connected-vet.com/wp-content/uploads/2023/10/iclassifier.png" // Replace with your actual image path
          alt="Livestock management"
          className="login-image"
        />
      </div>
    </div>
  );
};

export default Login;
