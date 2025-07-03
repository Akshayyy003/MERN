import React from "react";
import "./css/AddSubject.css";
import { useState } from "react";
import axios from "axios";

const AddSubjects = () => {
  const [subName, setSubName] = useState("")
  const [subCode, setsubCode] = useState("")
  const [branch, setBranch] = useState("")
  const [semester, setSem] = useState("")
  const [lec, setLec] = useState("")
  const [lab, setLab] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const result = await axios.post('http://localhost:5000/api/subjects/add', {
        subName: subName.toLowerCase(),
        subCode: subCode.toLowerCase(),
        branch: branch.toLowerCase(),
        semester,
        lec,
        lab
      });


      if (result.data === "success") {
        alert("✅ Subject added successfully!");
        setSubName("");
        setsubCode("");
        setBranch("");
        setSem("");
        setLec("");
        setLab("");
      } else {
        // This could be a validation message from backend
        alert("⚠️ " + result.data);
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
          <h2>Add Subject</h2>

          <form onSubmit={handleSubmit}>

            <div className="inputBx">
              <input type="text" placeholder="Subject Name"
                value={subName}
                onChange={(e) => setSubName(e.target.value)}
                required
              />
            </div>

            <div className="inputBx">
              <input type="text" placeholder="Subject Code"
                value={subCode}
                required
                onChange={(e) => setsubCode(e.target.value)}
              />
            </div>
            <div className="inputBx">
              <input type="text" placeholder="Branch"
                value={branch}
                required
                onChange={(e) => setBranch(e.target.value)}
              />
            </div>
            <div className="inputBx">
              <input type="text" placeholder="Semester"
                value={semester}
                required
                onChange={(e) => setSem(e.target.value)}
              />
            </div>
            <div className="inputBx">
              <input type="number" placeholder="Num of Lec Required per Week"
                value={lec}
                required
                onChange={(e) => setLec(e.target.value)}
              />
            </div>
            <div className="inputBx">
              <input type="number" placeholder="Num of Lab Required per Week"
                value={lab}
                required
                onChange={(e) => setLab(e.target.value)}
              />
            </div>
            <div className="inputBx">
              <input type="submit" value="Add Subject" />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddSubjects;
