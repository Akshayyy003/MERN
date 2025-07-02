import React, { useEffect, useState } from "react";
import "./css/TimetableCard.css";

const TimetableCard = ({
  disabledLab = false,
  onTypeChange = () => {},
  onDataChange = () => {},
  subjects = [],
  teachers = [],
  locations = [],
  divCount = 0,
  day,
  timeSlot,
  branch,
  semester
}) => {
  const divisions = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").slice(0, divCount);

  const [type, setType] = useState("");
  const [occupied, setOccupied] = useState({ teachers: [], rooms: [] });

  const [lectureData, setLectureData] = useState({
    subject: "",
    teacher: "",
    classRoom: ""
  });

  const [labData, setLabData] = useState(() => {
    const initial = {};
    divisions.forEach((div) => {
      initial[div] = { subject: "", teacher: "", classRoom: "" };
    });
    return initial;
  });

  // 🔁 Fetch occupied teachers & rooms when type/day/timeslot changes
  useEffect(() => {
    const fetchOccupied = async () => {
      if (!type || !day || !timeSlot || !branch || !semester) return;
      const [startTime, endTime] = timeSlot.split(" - ").map(t => t.trim());


      try {
        const res = await fetch(`http://localhost:5000/api/timetable/occupied?branch=${branch}&semester=${semester}&day=${day}&startTime=${startTime}&endTime=${endTime}`);
        const data = await res.json();
        setOccupied({
          teachers: data.occupiedTeachers || [],
          rooms: data.occupiedRooms || []
        });
      } catch (err) {
        console.error("Failed to fetch occupied", err);
      }
    };

    fetchOccupied();
  }, [type, day, timeSlot, branch, semester]);

  const handleTypeChange = (e) => {
    const selectedType = e.target.value;
    setType(selectedType);
    onTypeChange(selectedType);
  };

  const handleLectureChange = (field, value) => {
    const updated = { ...lectureData, [field]: value };
    setLectureData(updated);
    onDataChange({ type, lectureData: updated, labData });
  };

  const handleLabChange = (division, field, value) => {
    const updated = {
      ...labData,
      [division]: { ...labData[division], [field]: value }
    };
    setLabData(updated);
    onDataChange({ type, lectureData, labData: updated });
  };

  const renderOptions = (optionsArray, occupiedList = []) =>
    optionsArray.map((item, idx) => (
      <option key={idx} value={item} disabled={occupiedList.includes(item)}>
        {item} {occupiedList.includes(item) ? "(Occupied)" : ""}
      </option>
    ));

  return (
    <div className="timetable-card-wrapper">
      <div
        className="dropdown-card"
        style={{
          maxHeight: "350px",
          overflowY: type === "Lab" ? "auto" : "visible"
        }}
      >
        <label className="dropdown-label">
          <span className="label-text">Lab / Lecture</span>
          <select
            className="styled-dropdown"
            value={type}
            onChange={handleTypeChange}
          >
            <option value="">Select Type</option>
            <option value="Lecture">Lecture</option>
            <option value="Lab" disabled={disabledLab}>Lab</option>
          </select>
        </label>

        {type === "Lecture" && (
          <>
            <label className="dropdown-label">
              <span className="label-text">Subject</span>
              <select
                className="styled-dropdown"
                value={lectureData.subject}
                onChange={(e) => handleLectureChange("subject", e.target.value)}
              >
                <option value="">Select Subject</option>
                {renderOptions(subjects)}
              </select>
            </label>

            <label className="dropdown-label">
              <span className="label-text">Teacher</span>
              <select
                className="styled-dropdown"
                value={lectureData.teacher}
                onChange={(e) => handleLectureChange("teacher", e.target.value)}
              >
                <option value="">Select Teacher</option>
                {renderOptions(teachers, occupied.teachers)}
              </select>
            </label>

            <label className="dropdown-label">
              <span className="label-text">Class or Lab Number</span>
              <select
                className="styled-dropdown"
                value={lectureData.classRoom}
                onChange={(e) => handleLectureChange("classRoom", e.target.value)}
              >
                <option value="">Select Room</option>
                {renderOptions(locations, occupied.rooms)}
              </select>
            </label>
          </>
        )}

        {type === "Lab" &&
          divisions.map((div) => (
            <div key={div} style={{ marginBottom: "1rem" }}>
              <div className="division-heading">Division {div}</div>

              <label className="dropdown-label">
                <span className="label-text">Subject</span>
                <select
                  className="styled-dropdown"
                  value={labData[div]?.subject}
                  onChange={(e) => handleLabChange(div, "subject", e.target.value)}
                >
                  <option value="">Select Subject</option>
                  {renderOptions(subjects)}
                </select>
              </label>

              <label className="dropdown-label">
                <span className="label-text">Teacher</span>
                <select
                  className="styled-dropdown"
                  value={labData[div]?.teacher}
                  onChange={(e) => handleLabChange(div, "teacher", e.target.value)}
                >
                  <option value="">Select Teacher</option>
                  {renderOptions(teachers, occupied.teachers)}
                </select>
              </label>

              <label className="dropdown-label">
                <span className="label-text">Class or Lab Number</span>
                <select
                  className="styled-dropdown"
                  value={labData[div]?.classRoom}
                  onChange={(e) => handleLabChange(div, "classRoom", e.target.value)}
                >
                  <option value="">Select Room</option>
                  {renderOptions(locations, occupied.rooms)}
                </select>
              </label>
            </div>
          ))}
      </div>
    </div>
  );
};

export default TimetableCard;
