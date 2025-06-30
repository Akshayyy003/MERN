import React from 'react';
import './css/TimetableBuilder.css';

const TimetableBuilder = () => {
  const slotDuration = 60; // in minutes
  const breakDuration = 30; // in minutes
  const totalSlots = 6;
  const breakAfter = 3;
  const startTime = "10:30";

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  const getTimeSlots = () => {
    const slots = [];
    let [hours, minutes] = startTime.split(":").map(Number);
    
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

    for (let i = 0; i < totalSlots; i++) {
      const start = formatTime(hours, minutes);
      [hours, minutes] = addMinutes(hours, minutes, slotDuration);
      const end = formatTime(hours, minutes);

      slots.push(`${start} - ${end}`);

      if (i === breakAfter - 1) {
        const breakStart = formatTime(hours, minutes);
        [hours, minutes] = addMinutes(hours, minutes, breakDuration);
        const breakEnd = formatTime(hours, minutes);
        slots.push(`Break (${breakStart} - ${breakEnd})`);
      }
    }

    return slots;
  };

  const timeSlots = getTimeSlots();

  return (
    <div className="timetable-wrapper">
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
          {timeSlots.map((slot, idx) => (
            <tr key={idx} className={slot.includes("Break") ? "break-row" : ""}>
              <td className="time-label">{slot}</td>
              {days.map((day) => (
                <td key={day + idx} className="timetable-cell">
                  {slot.includes("Break") ? "—" : ""}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TimetableBuilder;
