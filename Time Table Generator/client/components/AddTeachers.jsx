import React from "react";
import "./css/Login.css"; // Reusing same styles for ring + form
import { useState } from "react";
import axios from "axios";


const AddTeachers = () => {
  const [name, setName] = useState("")
  const [Num, setNumber] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [branch, setBranch] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !Num || !email || !password || !branch) {
      return alert("⚠️ All fields are required.");
    }

    if (!/^[0-9]{10}$/.test(Num)) {
      return alert("⚠️ Number should be a valid 10-digit phone number.");
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      return alert("⚠️ Please enter a valid email address.");
    }

    if (password.length < 6) {
      return alert("⚠️ Password should be at least 6 characters long.");
    }

    try {
      const result = await axios.post('http://localhost:5000/api/teachers/add', {
        name,
        Num,
        email,
        password,
        branch: branch.toLowerCase(),
      });

      if (result.data.message === "success") {
        alert("✅ Teacher added successfully!");
        setName("");
        setNumber("");
        setBranch("");
        setEmail("");
        setPassword("");
      } else {
        alert("⚠️ " + result.data.message || "Something went wrong");
      }
    } catch (err) {
      if (err.response && err.response.data) {
        alert("❌ " + err.response.data);
      } else {
        alert("❌ Something went wrong. Please try again.");
      }
      console.error(err);
    }
  };

  return (
    <div className="main">
      <div className="ring" style={{ width: '700px', height: '700px' }}>
        <i style={{ "--clr": "#00ff0a" }}></i>
        <i style={{ "--clr": "#ff0057" }}></i>
        <i style={{ "--clr": "#fffd44" }}></i>
        <div className="login">
          <h2>Add Teacher</h2>
          <form onSubmit={handleSubmit}>
            <div className="inputBx">
              <input type="text" placeholder="Teacher Name" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <br />
            <div className="inputBx">
              <input type="number" placeholder="Teacher Number" value={Num} onChange={(e) => setNumber(e.target.value)} />
            </div>
            <br />
            <div className="inputBx">
              <input type="email" placeholder="Teacher Email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <br />
            <div className="inputBx">
              <input type="password" placeholder="Teacher Password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            <br />
            <div className="inputBx">
              <input type="text" placeholder="Teacher Branch" value={branch} onChange={(e) => setBranch(e.target.value)} />
            </div>
            <br />
            <div className="inputBx">
              <input type="submit" value="Add Teacher" />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddTeachers;
