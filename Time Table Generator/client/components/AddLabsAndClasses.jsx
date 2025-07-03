import React from "react";
import "./css/Login.css"; // Reuse existing styles with ring and form
import { useState } from "react";
import axios from "axios";

const AddLabsAndClasses = () => {

  const [branch, setBranch] = useState("")
  const [prefix, setPrefix] = useState("")
  const [numberOfLabs, setNumberOfLabs] = useState("")
  const [numberOfClasses, setNumberOfClasses] = useState("")


  const handleSubmit = async (e) => {
    e.preventDefault();


    try {
      const result = await axios.post('http://localhost:5000/api/locations/add', {
        branch: branch.toLowerCase(),
        prefix: prefix.toLowerCase(),
        numberOfLabs,
        numberOfClasses
      });

      if (result.data.message === "success") {
        alert("✅ Location added successfully!");
        setBranch("");
        setPrefix("");
        setNumberOfLabs("");
        setNumberOfClasses("");
      } else {
        alert("⚠️ " + result.data.message || "Something went wrong");
      }
    } catch (err) {
      if (err.response && err.response.data) {
        alert("❌ " + err.response.data);
      } else {
        alert("❌ Something went wrong. Please try again.");
      }
      console.error(err);
    }
  };

  return (
    <div className="main">
      <div className="ring" style={{ width: '700px', height: '700px' }}>
        <i style={{ "--clr": "#00ff0a" }}></i>
        <i style={{ "--clr": "#ff0057" }}></i>
        <i style={{ "--clr": "#fffd44" }}></i>
        <div className="login">
          <h2>Add Labs & Classes</h2>
          <form action="" onSubmit={handleSubmit}>

            <div className="inputBx">
              <input type="text" placeholder="Branch" value={branch}
                onChange={(e) => setBranch(e.target.value)} />
            </div>
            <br />
            <div className="inputBx">
              <input type="text" placeholder="Prefix Letter (e.g. L/C)" value={prefix}
                onChange={(e) => setPrefix(e.target.value)} />
            </div>
            <br />
            <div className="inputBx">
              <input type="number" placeholder="Number of Labs" value={numberOfLabs}
                onChange={(e) => setNumberOfLabs(e.target.value)} />
            </div>
            <br />
            <div className="inputBx">
              <input type="number" placeholder="Number of Classes" value={numberOfClasses}
                onChange={(e) => setNumberOfClasses(e.target.value)} />
            </div>
            <br />
            <div className="inputBx">
              <input type="submit" value="Add Labs & Classes" />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddLabsAndClasses;
