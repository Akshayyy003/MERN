import React from "react";
import "./css/Login.css"; // Reuse existing styles with ring and form

const AddLabsAndClasses = () => {
  return (
    <div className="main">
      <div className="ring">
        <i style={{ "--clr": "#00ff0a" }}></i>
        <i style={{ "--clr": "#ff0057" }}></i>
        <i style={{ "--clr": "#fffd44" }}></i>
        <div className="login">
          <h2>Add Labs & Classes</h2>

          <div className="inputBx">
            <input type="text" placeholder="Branch" />
          </div>

          <div className="inputBx">
            <input type="text" placeholder="Prefix Letter (e.g. L/C)" />
          </div>

          <div className="inputBx">
            <input type="number" placeholder="Number of Labs" />
          </div>

          <div className="inputBx">
            <input type="number" placeholder="Number of Classes" />
          </div>

          <div className="inputBx">
            <input type="submit" value="Add Labs & Classes" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddLabsAndClasses;
