import React from "react";
import "./css/Subject.css"; // Reusing your ring and form styles

const AddTimeSlots = () => {
  return (
    <div className="main">
      <div className="ring">
        <i style={{ "--clr": "#00ff0a" }}></i>
        <i style={{ "--clr": "#ff0057" }}></i>
        <i style={{ "--clr": "#fffd44" }}></i>
        <div className="login">
          <h2>Add Time Slots</h2>

          <div className="inputBx">
            <input type="number" placeholder="Length of Lecture (minutes)" />
          </div>

          <div className="inputBx">
            <input type="number" placeholder="Length of Lab (minutes)" />
          </div>

          <div className="inputBx">
            <input type="number" placeholder="Length of Break (minutes)" />
          </div>

          <div className="inputBx">
            <input type="number" placeholder="Number of Slots Before Break" />
          </div>

          <div className="inputBx">
            <input type="time" placeholder="Starting Time of College" />
          </div>

          <div className="inputBx">
            <input type="time" placeholder="Ending Time of College" />
          </div>

          <div className="inputBx">
            <input type="submit" value="Add Time Slots" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddTimeSlots;
