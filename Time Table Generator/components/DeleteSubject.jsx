import React from "react";
import "./css/Subject.css"; // Reusing styles from AddSubjects

const DeleteSubject = () => {
  const staticSubjects = [
    "Mathematics",
    "Physics",
    "Chemistry",
    "Biology",
    "Computer Science",
    "English",
    "Economics",
    "History",
  ];

  return (
    <div className="main">
      <div className="ring">
        <i style={{ "--clr": "#00ff0a" }}></i>
        <i style={{ "--clr": "#ff0057" }}></i>
        <i style={{ "--clr": "#fffd44" }}></i>
        <div className="login">
          <h2>Delete Subjects</h2>

          <div className="inputBx">
            <select
              multiple
              style={{
                height: "150px",
                backgroundColor: "#222",
                color: "white",
                padding: "0.5rem",
                borderRadius: "5px",
                width: "100%",
              }}
            >
              {staticSubjects.map((subject, index) => (
                <option key={index} value={subject}>
                  {subject}
                </option>
              ))}
            </select>
          </div>

          <div className="inputBx">
            <input type="submit" value="Delete Selected Subjects" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteSubject;
