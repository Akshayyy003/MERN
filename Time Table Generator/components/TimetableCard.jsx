import React, { useState } from "react";
import "./css/TimetableCard.css";

const TimetableCard = () => {
  const [subject, setSubject] = useState("");
  const [type, setType] = useState("");
  const [teacher, setTeacher] = useState("");

  const handleSubmit = () => {
    const data = { subject, type, teacher };
    console.log("Submitting:", data);
    // Backend integration here
  };

  return (
    <div className="timetable-card-wrapper">
      <div className="dropdown-card">

        <label className="dropdown-label">
          <span className="label-text">Subject</span>
          <select className="styled-dropdown" value={subject} onChange={(e) => setSubject(e.target.value)}>
            <option value="">Select Subject</option>
            <option value="Maths">Maths</option>
            <option value="Physics">Physics</option>
            <option value="Computer Science">Computer Science</option>
            <option value="Electronics">Electronics</option>
          </select>
        </label>

        <label className="dropdown-label">
          <span className="label-text">Lab / Lecture</span>
          <select className="styled-dropdown" value={type} onChange={(e) => setType(e.target.value)}>
            <option value="">Select Type</option>
            <option value="Lab">Lab</option>
            <option value="Lecture">Lecture</option>
          </select>
        </label>

        <label className="dropdown-label">
          <span className="label-text">Teacher</span>
          <select className="styled-dropdown" value={teacher} onChange={(e) => setTeacher(e.target.value)}>
            <option value="">Select Teacher</option>
            <option value="Prof. Sharma">Prof. Sharma</option>
            <option value="Dr. Mehta">Dr. Mehta</option>
            <option value="Ms. Desai">Ms. Desai</option>
            <option value="Mr. Patel">Mr. Patel</option>
          </select>
        </label>

        <button className="submit-button" onClick={handleSubmit}>Submit</button>
      </div>
    </div>
  );
};

export default TimetableCard;
