import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import './Register.css';

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const username = formData.get("username");
    const email = formData.get("email");
    const password = formData.get("password");
    const confirmPassword = formData.get("confirmPassword");

    // Check if passwords match
    if (password === confirmPassword) {
      try {
        // Make the POST request to register the user
        const response = await axios.post("http://127.0.0.1:8000/register", {
          username,
          email,
          hashed_password: password, // Backend expects hashed_password
        });

        // Handle successful registration
        console.log(response.data);
        alert("Registration successful!");
        navigate("/login"); // Navigate to login after successful registration
      } catch (error) {
        // Handle errors based on response from the backend
        const errorMessage = error?.response?.data?.detail || "Failed to register. Please try again.";
        setError(errorMessage);
      }
    } else {
      setError("Passwords do not match. Please try again.");
    }
  };

  return (
    <div className="register-container">
      {/* Image on Left */}
      <div className="register-left">
        <img
          src="https://www.aiplusinfo.com/wp-content/uploads/2024/12/AI-in-Livestock-Management-1536x878.jpeg.webp" // Replace with the correct image path
          alt="AI Livestock Monitoring"
          className="register-image"
        />
      </div>

      {/* Form on Right */}
      <div className="background-box">
        <div className="register-right">
          <h2 className="register-title">Create Account</h2>
          <form className="register-form" onSubmit={handleRegister}>
            <div className="form-group">
              <input
                type="text"
                className="input-field"
                placeholder="Username"
                name="username"
                required
              />
            </div>
            <div className="form-group">
              <input
                type="email"
                className="input-field"
                placeholder="Email Address"
                name="email"
                required
              />
            </div>
            <div className="form-group">
              <input
                type={showPassword ? "text" : "password"}
                className="input-field"
                placeholder="Password"
                name="password"
                required
              />
              <span
                className="toggle-visibility"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "👁️" : "👁️‍🗨️"}
              </span>
            </div>
            <div className="form-group">
              <input
                type={showConfirmPassword ? "text" : "password"}
                className="input-field"
                placeholder="Confirm Password"
                name="confirmPassword"
                required
              />
              <span
                className="toggle-visibility"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? "👁️" : "👁️‍🗨️"}
              </span>
            </div>
            {error && <p className="error">{error}</p>}
            <button type="submit" className="btn-register">
              Create Account
            </button>
            <p className="register-footer">
              Already have an account?{" "}
              <span
                className="link"
                onClick={() => navigate("/")}
              >
                Log in
              </span>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
