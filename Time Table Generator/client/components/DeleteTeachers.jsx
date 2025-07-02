import React, { useEffect, useState } from "react";
import axios from "axios";
import "./css/Subject.css"; // Reuse neon ring & form styles

const DeleteTeachers = () => {
  const [teachers, setTeachers] = useState([]);
  const [selectedTeachers, setSelectedTeachers] = useState([]);

  // Fetch teacher list from backend
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/teachers") // update this endpoint if needed
      .then((res) => setTeachers(res.data))
      .catch((err) => console.error("Fetch error:", err));
  }, []);

  // Handle selected options
  const handleSelectChange = (e) => {
    const selected = Array.from(e.target.selectedOptions).map((opt) => opt.value);
    setSelectedTeachers(selected);
  };

  // Delete selected teachers
  const handleDelete = async () => {
    if (selectedTeachers.length === 0) {
      return alert("⚠️ Please select at least one teacher to delete.");
    }

    const confirmDelete = window.confirm(
      `Are you sure you want to delete ${selectedTeachers.length} teacher(s)?`
    );
    if (!confirmDelete) return;

    try {
      await axios.post("http://localhost:5000/api/teachers/delete", {
        teachers: selectedTeachers,
      });

      alert("✅ Selected teachers deleted!");

      // Remove deleted teachers from UI
      setTeachers(teachers.filter(t => !selectedTeachers.includes(t.name)));
      setSelectedTeachers([]);
    } catch (err) {
      console.error("Delete error:", err);
      alert("❌ Failed to delete selected teachers.");
    }
  };

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
              value={selectedTeachers}
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
              {teachers.map((teacher, index) => (
                <option key={index} value={teacher.name}>
                  {teacher.name} | {teacher.branch} | {teacher.email}
                </option>
              ))}
            </select>
          </div>

          <div className="inputBx">
            <input
              type="button"
              value="Delete Selected Teachers"
              onClick={handleDelete}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteTeachers;
