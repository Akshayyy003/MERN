import React from "react";
import "./css/Subject.css"; // Reusing your ring and form styles
import { useState } from "react";
import axios from "axios";
const AddTimeSlots = () => {

  const [branch, setBranch] = useState("")
  const [slotlen, setslotLen] = useState("")
  const [breakLen, setBreakLen] = useState("")
  const [slotsBeforeBreak, setSlotsBeforeBreak] = useState("")
  const [startTime, setStartTime] = useState("")


  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const result = await axios.post('http://localhost:5000/api/timeslots/add', {
        branch,
        slotlen,
        breakLen,
        slotsBeforeBreak,
        startTime
      });

      if (result.data.message === "success") {
        alert("✅ Time slots added successfully!");
        setslotLen("");
        setBreakLen("");
        setSlotsBeforeBreak("");
        setStartTime("");
      } else {
        alert("⚠️ " + result.data.message || "Something went wrong");
      }
    } catch (err) {
      if (err.response && err.response.data) {
        alert("❌ " + err.response.data.message);
      } else {
        alert("❌ Something went wrong. Please try again.");
      }
      console.error(err);
    }
  };

  return (
    <div className="main">
      <div className="ring" style={{ width: '700px', height: '750px' }}>
        <i style={{ "--clr": "#00ff0a" }}></i>
        <i style={{ "--clr": "#ff0057" }}></i>
        <i style={{ "--clr": "#fffd44" }}></i>
        <div className="login">
          <h2>Add Time Slots</h2>
          <form action="" onSubmit={handleSubmit}>
            <div className="inputBx">
              <input type="text" placeholder="Branch" value={branch} onChange={(e) => setBranch(e.target.value)} />
            </div>
            <br />
            <div className="inputBx">
              <input type="number" placeholder="Length of Slot (Minutes) " value={slotlen} onChange={(e) => setslotLen(e.target.value)} />
            </div>
            <br />
            <div className="inputBx">
              <input type="number" placeholder="Length of Break (minutes)" value={breakLen} onChange={(e) => setBreakLen(e.target.value)} />
            </div>
            <br />
            <div className="inputBx">
              <input type="number" placeholder="Num of Slots Before Break" value={slotsBeforeBreak} onChange={(e) => setSlotsBeforeBreak(e.target.value)} />
            </div>
            <br />
            Starting Time
            <div className="inputBx">
              <input type="time" placeholder="Starting Time of College" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
            </div>
            <br />

            <div className="inputBx">
              <input type="submit" value="Add Time Slots" />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddTimeSlots;
