import React from "react";
import "./css/Login.css"; // Reusing same styles for ring + form

const AddTeachers = () => {
  return (
    <div className="main">
      <div className="ring">
        <i style={{ "--clr": "#00ff0a" }}></i>
        <i style={{ "--clr": "#ff0057" }}></i>
        <i style={{ "--clr": "#fffd44" }}></i>
        <div className="login">
          <h2>Add Teacher</h2>

          <div className="inputBx">
            <input type="text" placeholder="Teacher Name" />
          </div>

          <div className="inputBx">
            <input type="text" placeholder="Teacher Number" />
          </div>

          <div className="inputBx">
            <input type="email" placeholder="Teacher Email" />
          </div>

          <div className="inputBx">
            <input type="password" placeholder="Teacher Password" />
          </div>

          <div className="inputBx">
            <input type="submit" value="Add Teacher" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddTeachers;
