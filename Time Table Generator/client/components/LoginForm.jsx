import React, { useState } from "react";
import axios from "axios";
import "./css/Login.css";
import { useNavigate, Navigate, Link } from "react-router-dom";
import { Info, X, CheckCircle, Lock, Mail, Phone } from 'lucide-react';

const LoginForm = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showInfo, setShowInfo] = useState(false);

  const isLoggedIn = sessionStorage.getItem("isLoggedIn") === "true";

  if (isLoggedIn) {
    return <Navigate to="/home" replace />;
  }

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const result = await axios.post("http://localhost:5000/api", {
        email: email.trim().toLowerCase(),
        password,
      });

      if (result.data.message === "Login successful") {
        alert("Successfully logged in");

        sessionStorage.setItem("isLoggedIn", "true");
        sessionStorage.setItem("user", JSON.stringify(result.data.user));
        sessionStorage.setItem("email", result.data.user.email);

        navigate("/home");
      } else {
        alert(result.data.message || "Login failed");
      }
    } catch (err) {
      if (err.response && err.response.data) {
        alert(err.response.data.message || "Login failed");
      } else {
        alert("Something went wrong. Please try again.");
      }
      console.error("Login error:", err);
    }
  };

  return (
    <div className="main">
      {/* System Info Button */}
      <button
        onClick={() => setShowInfo(!showInfo)}
        className="system-info-btn"
      >
        ℹ️ <span className="system-info-text">System Info</span>
      </button>

      {/* Info Modal */}
      {showInfo && (
        <div className="system-info-modal">
          <div className="system-info-card">
            <button
              onClick={() => setShowInfo(false)}
              className="system-info-close"
            >
              ✖
            </button>

            <div className="system-info-content">
              <div className="system-info-header">
                <div className="system-info-icon">🔒</div>
                <h2>Timetable Management System</h2>
                <p>
                  Effortlessly create, manage, and auto-generate timetables for your
                  institution with our advanced AI-powered platform.
                </p>
              </div>

              <div className="system-info-features">
                <h3>✔ Key Features</h3>
                <ul>
                  <li>AI-based automatic timetable generation</li>
                  <li>Manual timetable builder with live conflict detection</li>
                  <li>Subject-wise lecture & lab tracking</li>
                  <li>Teacher and classroom availability check</li>
                  <li>Export timetables as PDF</li>
                  <li>Secure role-based access (Admin & Teachers)</li>
                </ul>
              </div>

              <div className="system-info-access">
                <h3>Access Restricted</h3>
                <p>
                  This platform is exclusively for authorized educational institution
                  members.
                </p>
                <p>To request access credentials, please contact the System Administrator:</p>
                <div className="contact-info">
                  <div>📧 shiyaniakshay37@gmail.com</div>
                  <div>📞 +91 96244 20209</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}


      {/* Login Form */}
      <div className="ring">
        <i style={{ "--clr": "#00ff0a" }}></i>
        <i style={{ "--clr": "#ff0057" }}></i>
        <i style={{ "--clr": "#fffd44" }}></i>
        <div className="login">
          <h2>Login</h2>
          <form onSubmit={handleLogin}>
            <div className="inputBx">
              <input
                type="email"
                placeholder="Email"
                value={email}
                required
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <br />
            <div className="inputBx">
              <input
                type="password"
                placeholder="Password"
                value={password}
                required
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <br />
            <div className="inputBx">
              <input type="submit" value="Sign in" />
            </div>
          </form>
          <div className="links">
            <Link to="/forgot-password">Forgot Password?</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
