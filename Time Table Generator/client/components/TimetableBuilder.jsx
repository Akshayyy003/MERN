import React, { useState, useEffect } from 'react';
import TimetableCard from './TimetableCard';
import './css/TimetableBuilder.css';
import axios from 'axios';
import FooterComponent from './FooterComponent';

const TimetableBuilder = () => {
  const [subjectRequirements, setSubjectRequirements] = useState({});
  const [visible, setVisible] = useState(true);
  const [subjectCounts, setSubjectCounts] = useState({});

  const [div, setDiv] = useState("");
  const [branch, setBranch] = useState("");
  const [config, setConfig] = useState(null);
  const [semester, setSemester] = useState("");
  const [options, setOptions] = useState({
    teachers: [],
    subjects: [],
    locations: [],
  });
  const [timetableData, setTimetableData] = useState({});
  const [labSelections, setLabSelections] = useState({});

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];


  useEffect(() => {
    const fetchSubjectRequirements = async () => {
      if (!branch || !semester) return;
      try {
        const res = await axios.get(`http://localhost:5000/api/subject-requirements/${branch}/${semester}`);
        const requirements = res.data.requirements;
        setSubjectRequirements(requirements);

        // Clone counts for tracking
        const countsCopy = {};
        for (let key in requirements) {
          countsCopy[key] = {
            lec: requirements[key].lec,
            lab: requirements[key].lab
          };
        }
        setSubjectCounts(countsCopy);
      } catch (err) {
        console.error("Failed to fetch subject requirements", err);
      }
    };

    fetchSubjectRequirements();
  }, [branch, semester]);


  useEffect(() => {
    const fetchOptions = async () => {
      if (!branch || !semester) return;

      try {
        const res = await axios.get(
          `http://localhost:5000/api/options/${branch.toLowerCase()}/${parseInt(semester)}`
        );
        setOptions(res.data);
      } catch (err) {
        console.error("Failed to fetch dropdown options", err);
        alert("❌ Failed to fetch teacher/subject/location options");
      }
    };

    fetchOptions();
  }, [branch, semester]);

  const fetchConfig = async (selectedBranch) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/config/${selectedBranch}`);
      setConfig(res.data);
    } catch (err) {
      console.error("Failed to fetch config:", err);
      alert("❌ No Time slots found for this branch");
      setConfig(null);
    }
  };

  const getTimeSlots = () => {
    if (!config) return [];

    const slots = [];
    let [hours, minutes] = config.startTime.split(":").map(Number);

    const addMinutes = (h, m, minsToAdd) => {
      const total = h * 60 + m + minsToAdd;
      return [Math.floor(total / 60), total % 60];
    };

    const formatTime = (h, m) => {
      const suffix = h >= 12 ? "PM" : "AM";
      const hour12 = ((h + 11) % 12 + 1);
      const mm = m.toString().padStart(2, '0');
      return `${hour12}:${mm} ${suffix}`;
    };

    for (let i = 0; i < config.slotsBeforeBreak + 3; i++) {
      const start = formatTime(hours, minutes);
      [hours, minutes] = addMinutes(hours, minutes, config.slotlen);
      const end = formatTime(hours, minutes);

      slots.push({ time: `${start} - ${end}`, isBreak: false });

      if (i === config.slotsBeforeBreak - 1) {
        const breakStart = formatTime(hours, minutes);
        [hours, minutes] = addMinutes(hours, minutes, config.breakLen);
        const breakEnd = formatTime(hours, minutes);

        slots.push({ time: `Break (${breakStart} - ${breakEnd})`, isBreak: true });
      }
    }

    return slots;
  };

  const timeSlots = getTimeSlots();

  const canHostLab = (slotIndex) => {
    if (slotIndex >= timeSlots.length - 1) return false;
    if (timeSlots[slotIndex].isBreak || timeSlots[slotIndex + 1].isBreak) return false;
    return true;
  };

  const handleLabSelection = (day, index, isLab) => {
    const newSelections = { ...labSelections };
    newSelections[`${day}-${index}`] = isLab;
    setLabSelections(newSelections);
  };

  const handleSlotDataChange = (day, index, data) => {
    const key = `${day}-${index}`;

    const prevData = timetableData[key];
    const updated = { ...timetableData, [key]: data };
    setTimetableData(updated);

    const adjustCounts = (subject, type, delta) => {
      if (!subject || !type || !subjectCounts[subject]) return;
      setSubjectCounts(prev => ({
        ...prev,
        [subject]: {
          ...prev[subject],
          [type]: Math.max(0, prev[subject][type] + delta)
        }
      }));
    };

    // Revert previous selection
    if (prevData?.type === "Lecture") {
      adjustCounts(prevData.lectureData.subject, "lec", 1);
    } else if (prevData?.type === "Lab") {
      for (const div in prevData.labData) {
        const subj = prevData.labData[div].subject;
        adjustCounts(subj, "lab", 1);
      }
    }

    // Apply new selection
    if (data?.type === "Lecture") {
      adjustCounts(data.lectureData.subject, "lec", -1);
    } else if (data?.type === "Lab") {
      for (const div in data.labData) {
        const subj = data.labData[div].subject;
        adjustCounts(subj, "lab", -1);
      }
    }
  };

  const reset = () => {
    setDiv("");
    setBranch("");
    setSemester("");
    setConfig(null);
    setOptions({ teachers: [], subjects: [], locations: [] });
    setTimetableData({});
    setLabSelections({});
  }
  const handleSubmit = async () => {
    const timetableArray = [];

    for (let day of days) {
      for (let i = 0; i < timeSlots.length; i++) {
        const slot = timeSlots[i];
        const key = `${day}-${i}`;

        if (slot.isBreak) {
          timetableArray.push({
            day,
            startTime: slot.time.split(" - ")[0].replace("Break (", ""),
            endTime: slot.time.split(" - ")[1].replace(")", ""),
            type: "Break"
          });
          continue;
        }

        const cellData = timetableData[key];
        if (!cellData) continue;

        if (cellData.type === "Lecture") {
          timetableArray.push({
            day,
            startTime: slot.time.split(" - ")[0],
            endTime: slot.time.split(" - ")[1],
            type: "Lecture",
            subject: cellData.lectureData.subject,
            teacher: cellData.lectureData.teacher,
            room: cellData.lectureData.classRoom,
            group: null,
          });
        } else if (cellData.type === "Lab") {
          for (const division in cellData.labData) {
            const data = cellData.labData[division];
            timetableArray.push({
              day,
              startTime: slot.time.split(" - ")[0],
              endTime: timeSlots[i + 1].time.split(" - ")[1],
              type: "Lab",
              subject: data.subject,
              teacher: data.teacher,
              room: data.classRoom,
              group: division
            });
          }
          i++; // skip next slot (lab takes 2)
        }
      }
    }

    try {
      const payload = {
        branch,
        semester,
        timetable: timetableArray
      };

      await axios.post("http://localhost:5000/api/timetable/save", payload);
      alert("✅ Timetable saved successfully");

      // Reset all
      reset();

    } catch (err) {
      console.error(err);
      alert("❌ Failed to save timetable");
    }
  };

  return (
    <div className="timetable-wrapper" style={{ paddingBottom: "200px" }}>
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', paddingLeft: '1rem' }}>
        <label className="dropdown-label">
          <span className="label-text">Branch</span>
          <select
            className="styled-dropdown"
            value={branch}
            onChange={(e) => {
              const selected = e.target.value;
              setBranch(selected);
              fetchConfig(selected);
            }}
          >
            <option value="">Select Branch</option>
            <option value="CSE">CSE</option>
            <option value="Chemical">Chemical</option>
            <option value="Electric">Electric</option>
            <option value="Electronics">Electronics</option>
          </select>
        </label>

        <label className="dropdown-label">
          <span className="label-text">Semester</span>
          <select
            className="styled-dropdown"
            value={semester}
            onChange={(e) => setSemester(e.target.value)}
          >
            <option value="">Select Semester</option>
            {[...Array(8)].map((_, i) => (
              <option key={i + 1} value={i + 1}>{`${i + 1}th`}</option>
            ))}
          </select>
        </label>

        <div className="inputBx">
          <input
            type="number"
            placeholder="Number of Divisions"
            value={div}
            onChange={(e) => setDiv(e.target.value)}
          />
        </div>
      </div>

      <table className="timetable">
        <thead>
          <tr>
            <th>Time</th>
            {days.map((day) => (
              <th key={day}>{day}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {timeSlots.map((slot, idx) => {
            if (slot.isBreak) {
              return (
                <tr key={idx} className="break-row">
                  <td className="time-label">{slot.time}</td>
                  {days.map((day) => (
                    <td key={day + idx} className="timetable-cell">—</td>
                  ))}
                </tr>
              );
            }

            return (
              <tr key={idx}>
                <td className="time-label">{slot.time}</td>
                {days.map((day) => {
                  const slotKey = `${day}-${idx}`;
                  const prevKey = `${day}-${idx - 1}`;
                  if (labSelections[prevKey]) return null;
                  const isLab = labSelections[slotKey];

                  return (
                    <td
                      key={day + idx}
                      className="timetable-cell"
                      rowSpan={isLab ? 2 : 1}
                      style={{ verticalAlign: 'top' }}
                    >
                      <TimetableCard
                        day={day}
                        timeSlot={slot.time}
                        branch={branch}
                        semester={semester}
                        disabledLab={!canHostLab(idx)}
                        onTypeChange={(type) => handleLabSelection(day, idx, type === 'Lab')}
                        onDataChange={(data) => handleSlotDataChange(day, idx, data)}
                        subjects={options.subjects}
                        teachers={options.teachers}
                        locations={options.locations}
                        divCount={parseInt(div)}
                      />
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>

      <div style={{ marginTop: "20px", textAlign: "center" }}>
        <button className="submit-button" onClick={handleSubmit}>Submit Timetable</button>

        <button className="submit-button" style={{ marginLeft: "20px" }} onClick={reset}>Reset Timetable</button>
      </div>


      <FooterComponent subjectRequirements={subjectCounts} />

      {!visible && (
        <div style={{ textAlign: 'center', marginTop: '1rem' }}>
          <button className="submit-button" onClick={() => setVisible(true)}>
            Show Requirements ⬆
          </button>
        </div>
      )}


    </div>
  );
};

export default TimetableBuilder;
