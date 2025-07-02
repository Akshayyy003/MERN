import React, { useState } from "react";
import axios from "axios";
import "./css/Login.css"; // Using your existing Login.css

const ChangePassword = () => {
  const [email, setEmail] = useState(localStorage.getItem("email") || "");
  console.log("Email ",email)

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      return alert("❌ New passwords do not match!");
    }

    setLoading(true);
    try {
      const res = await axios.post("http://localhost:5000/api/cp/change-password", {
        email,
        oldPassword,
        newPassword,
      });

      alert("✅ Password changed successfully!");
      setEmail("");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      alert("❌ Failed to change password: " + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="main" style={{ "--clr": "#ff357a" }}>
      <div className="ring">
        <i></i>
        <i></i>
        <i></i>
        <div className="login">
          <form onSubmit={handleSubmit} style={{ width: "100%" }}>
            <h2>Change Password</h2>
            <div className="inputBx">
              <input
                type="email"
                placeholder="Email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                readOnly
              />
            </div>
            <div className="inputBx">
              <input
                type="password"
                placeholder="Old Password"
                required
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
              />
            </div>
            <div className="inputBx">
              <input
                type="password"
                placeholder="New Password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
            <div className="inputBx">
              <input
                type="password"
                placeholder="Confirm New Password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
            <div className="inputBx">
              <input
                type="submit"
                value={loading ? "Updating..." : "Change Password"}
                disabled={loading}
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;
