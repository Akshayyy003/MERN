import React, { useState } from "react";
import axios from "axios";
import "./css/Login.css"; // reuse login styles
import { Link } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleForgot = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post("http://localhost:5000/api/forgot/forgot-password", {
        email,
      });

      alert(res.data.message || "✅ Password reset email sent");
    } catch (err) {
      alert(err.response?.data?.message || "❌ Error sending password reset");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="main" style={{ "--clr": "#00f" }}>
      <div className="ring">
        <i></i>
        <i></i>
        <i></i>
        <div className="login">
          <form onSubmit={handleForgot} style={{ width: "100%" }}>
            <h2>Forgot Password</h2>
            <div className="inputBx">
              <input
                type="email"
                placeholder="Enter your registered email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="inputBx">
              <input type="submit" value={loading ? "Sending..." : "Send New Password"} />
            </div>
          </form>
          <div className="inputBx">
              <Link to="/">Back to Login Page</Link>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
