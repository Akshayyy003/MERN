import React from "react";
import "./css/Subject.css"; // Reuse your existing neon ring and form styles

const DeleteTeachers = () => {
  const staticTeachers = [
    "Prof. A. Sharma",
    "Dr. B. Mehta",
    "Ms. C. Desai",
    "Mr. D. Patel",
    "Prof. E. Singh",
    "Dr. F. Reddy",
  ];

  return (
    <div className="main">
      <div className="ring">
        <i style={{ "--clr": "#00ff0a" }}></i>
        <i style={{ "--clr": "#ff0057" }}></i>
        <i style={{ "--clr": "#fffd44" }}></i>
        <div className="login">
          <h2>Delete Teachers</h2>

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
              {staticTeachers.map((teacher, index) => (
                <option key={index} value={teacher}>
                  {teacher}
                </option>
              ))}
            </select>
          </div>

          <div className="inputBx">
            <input type="submit" value="Delete Selected Teachers" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteTeachers;
