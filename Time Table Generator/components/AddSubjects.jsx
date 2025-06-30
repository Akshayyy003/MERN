import React from "react";
import "./css/Login.css";

const AddSubjects = () => {
  return (  
    <div className="main">
      <div className="ring">
        <i style={{ "--clr": "#00ff0a" }}></i>
        <i style={{ "--clr": "#ff0057" }}></i>
        <i style={{ "--clr": "#fffd44" }}></i>
        <div className="login">
          <h2>Add Subject</h2>

          <div className="inputBx">
            <input type="text" placeholder="Subject Name" />
          </div>

          <div className="inputBx">
            <input type="text" placeholder="Subject Code" />
          </div>

          <div className="inputBx">
            <input type="text" placeholder="Branch" />
          </div>

          <div className="inputBx">
            <input type="text" placeholder="Semester" />
          </div>

          <div className="inputBx">
            <input type="submit" value="Add Subject" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddSubjects;
