import React, { useEffect, useState } from "react";
import axios from "axios";

const DeleteSubjects = () => {
  const [subjects, setSubjects] = useState([]);
  const [selectedSubjects, setSelectedSubjects] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/delete/subjects")
      .then((res) => setSubjects(res.data))
      .catch((err) => console.error(err));
  }, []);

  const handleDelete = async () => {
  if (selectedSubjects.length === 0) {
    alert("⚠️ Please select at least one subject to delete.");
    return;
  }

  const confirmed = window.confirm(
    `Are you sure you want to delete ${selectedSubjects.length} subject(s)?`
  );

  if (!confirmed) return;

  try {
    await axios.post("http://localhost:5000/home/delete-selected-subjects", {
      subjects: selectedSubjects,
    });

    alert("✅ Selected subjects deleted!");

    // Update UI
    setSubjects(subjects.filter((sub) => !selectedSubjects.includes(sub.subName)));
    setSelectedSubjects([]);
  } catch (err) {
    console.error("Delete error:", err);
    alert("❌ Failed to delete selected subjects.");
  }
};


  const handleSelectChange = (e) => {
    const selected = Array.from(e.target.selectedOptions).map((opt) => opt.value);
    setSelectedSubjects(selected);
  };  

  return (
    <div className="main">
      <div className="ring">
        <i style={{ "--clr": "#00ff0a" }}></i>
        <i style={{ "--clr": "#ff0057" }}></i>
        <i style={{ "--clr": "#fffd44" }}></i>
        <div className="login">
          <h2>Select Subjects</h2>

          <div className="inputBx">
            <select
              multiple
              value={selectedSubjects}
              onChange={handleSelectChange}
              style={{
                height: "150px",
                backgroundColor: "#222",
                color: "white",
                padding: "0.5rem",
                borderRadius: "5px",
                width: "100%",
              }}
            >
              {subjects.map((subject, index) => (
                <option key={index} value={subject.subName}>
                  {subject.subName} : {subject.subCode} : {subject.branch}
                </option>
              ))}
            </select>
          </div>

          <div className="inputBx">
            <input type="button" value="Select Subjects to Delete" onClick={handleDelete}  />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteSubjects;
