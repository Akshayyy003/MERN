import React from "react";
import "./css/Subject.css"; // Reusing ring and input styles

const DeleteLabsAndClasses = () => {
  const staticItems = [
    "CSE Lab 1",
    "CSE Lab 2",
    "CSE Class A",
    "CSE Class B",
    "ECE Lab 1",
    "ECE Class A",
  ];

  return (
    <div className="main">
      <div className="ring">
        <i style={{ "--clr": "#00ff0a" }}></i>
        <i style={{ "--clr": "#ff0057" }}></i>
        <i style={{ "--clr": "#fffd44" }}></i>
        <div className="login">
          <h2>Delete Labs & Classes</h2>

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
              {staticItems.map((item, index) => (
                <option key={index} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          <div className="inputBx">
            <input type="submit" value="Delete Selected Items" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteLabsAndClasses;
