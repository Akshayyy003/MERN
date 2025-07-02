import React from "react";
import "./css/HomePageIntro.css"; // Make sure to import the CSS

const HomePageIntro = () => {
  return (
    <div className="intro-container">
      <h1 className="intro-title">🧠 AI-Based Timetable Generator</h1>

      <p className="intro-description">
        Welcome to the <span className="highlight">AI-Powered Timetable Generator</span> — a smart and intuitive platform designed to automate and simplify academic timetable creation.
      </p>

      <p className="intro-subtext">This MERN stack project allows administrators and teachers to:</p>

      <ul className="intro-list">
        <li>✅ Manage subjects, teachers, classes, labs, and time slots</li>
        <li>✅ Define teacher availability and constraints</li>
        <li>✅ Automatically generate conflict-free timetables using AI</li>
        <li>✅ Prevent overlaps between teachers, classes, and labs</li>
      </ul>

      <div className="intro-developer">
        <h2>👨‍💻 About the Developer</h2>
        <p><strong>Akshay Shiyani</strong><br />
        Final Year Student – B.E. Computer Science & Engineering<br />
        The Maharaja Sayajirao University of Baroda (MSU Baroda)</p>
      </div>
    </div>
  );
};

export default HomePageIntro;
