import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUser, FaLock } from "react-icons/fa6";
import bgImage from "../../assets/Ramco.jpg";
import "./Login.css";



function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const API_BASE = import.meta.env.VITE_API_BASE_URL;
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch(`${API_BASE}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const data = await response.json();

    if (response.status === 200) {
      // Store token
      localStorage.setItem("User", data.token);

      // Decode token to check role
      const payload = JSON.parse(atob(data.token.split(".")[1]));
      const userId = payload.id;

      // Fetch full profile for role check
      const profileRes = await fetch("http://localhost:5001/profile", {
        headers: { Authorization: `Bearer ${data.token}` },
      });

      const profile = await profileRes.json();
      if (profile.role === "coordinator") {
        navigate("/dashboard");
      } else {
        navigate("/dashboard");
      }
    } else {
      setMessage(data.message);
    }
  };

  return (
    <div className="login-container">
      <div
        className="login-left"
        style={{ backgroundImage: `url(${bgImage})` }}
      >
        <div className="overlay"></div>
      </div>

      <div className="login-right">
        <form className="login-form" onSubmit={handleSubmit}>
          <h2>Welcome Back!</h2>
          <p>Access your portal to explore upcoming events.</p>

          <label>Email</label>
          <div className="login_input_container">
            <FaUser className="login_icon" size={16} />
            <input
              type="text"
              name="email"
              onChange={handleChange}
              placeholder="Enter your email"
              required
            />
          </div>

          <label>Password</label>
          <div className="login_input_container">
            <FaLock className="login_icon" size={16} />
            <input
              type="password"
              name="password"
              onChange={handleChange}
              placeholder="Enter your password"
              required
            />
          </div>

          <div className="login-options">
            <Link to="/forgot-password" className="forgot-password">
              Forgot Password?
            </Link>
          </div>

          <button type="submit">Sign In</button>

          {message && (
            <p
              style={{ color: "red", marginTop: "10px" }}
              className="error-message"
            >
              {message}
            </p>
          )}

          <p style={{ marginTop: "1rem" }}>
            Don’t have an account?{" "}
            <Link to="/Newuser" className="signup-link">
              Sign Up
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;
