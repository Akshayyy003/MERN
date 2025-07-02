import React, { useState } from "react";
import axios from "axios";
import "./css/Login.css";
import { useNavigate, Navigate } from "react-router-dom";
import { Link } from "react-router-dom";

const LoginForm = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

  if (isLoggedIn) {
    return <Navigate to="/home" replace />;
  }

  const handleLogin = async (e) => {
  e.preventDefault();

  try {
    const result = await axios.post('http://localhost:5000/api', {
      email: email.trim().toLowerCase(),
      password,
    });

    // ✅ Check message from backend
    if (result.data.message === "Login successful") {
      alert("Successfully logged in");

      // Optional: Save user data to localStorage
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("user", JSON.stringify(result.data.user));
      localStorage.setItem("email", result.data.user.email); 


      navigate('/home');
    } else {
      alert(result.data.message || "Login failed");
    }
  } catch (err) {
    // ✅ Handle error messages from backend
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
