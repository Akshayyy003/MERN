import { useState, useEffect } from 'react';
import axios from 'axios';
import './css/TimetableBuilder.css';

const UserTimetable = () => {
  const [timetable, setTimetable] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userEmail, setUserEmail] = useState(sessionStorage.getItem("email") || "");
  const [timeSlots, setTimeSlots] = useState([]);

  useEffect(() => {
    fetchUserTimetable(userEmail);
  }, [userEmail]);

  const fetchUserTimetable = async (email) => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:5000/api/timetable/user?email=${email}`);
      
      const data = Array.isArray(response.data) ? response.data : [];
      setTimetable(data);
      
      // Extract unique time slots from the timetable data
      const slots = extractTimeSlots(data);
      setTimeSlots(slots);
      
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      setLoading(false);
    }
  };

  // Function to extract and format unique time slots from timetable data
  const extractTimeSlots = (slots) => {
    if (!Array.isArray(slots)) return [];
    
    const timeMap = new Map();
    
    slots.forEach(slot => {
      const key = `${slot.startTime}-${slot.endTime}`;
      if (!timeMap.has(key)) {
        timeMap.set(key, {
          startTime: slot.startTime,
          endTime: slot.endTime,
          formatted: `${slot.startTime}-${slot.endTime}`
        });
      }
    });
    
    // Sort time slots chronologically
    return Array.from(timeMap.values()).sort((a, b) => {
      return a.startTime.localeCompare(b.startTime);
    });
  };

  const groupByDay = (slots) => {
    if (!Array.isArray(slots)) return {};
    return slots.reduce((acc, slot) => {
      if (!acc[slot.day]) {
        acc[slot.day] = [];
      }
      acc[slot.day].push(slot);
      return acc;
    }, {});
  };

  const daysOrder = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  // Safely filter user slots
  const userSlots = Array.isArray(timetable) ? timetable : [];

  
  const slotsByDay = groupByDay(userSlots);

  if (loading) {
    return (
      <div className="timetable-wrapper">
        <div className="submit-button generating">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="timetable-wrapper">
        <div className="error-message">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="timetable-wrapper">
      <h2>Your Schedule</h2>
      <div className="inputBx">
        <input 
          type="text" 
          placeholder="Enter your email..."
          value={userEmail}
          onChange={(e) => setUserEmail(e.target.value)}
        />
      </div>

      <table className="timetable">
        <thead>
          <tr>
            <th>Time</th>
            {daysOrder.map(day => (
              <th key={day}>{day}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {timeSlots.map((timeSlot, index) => (
            <tr key={index}>
              <td className="time-label">{timeSlot.formatted}</td>
              {daysOrder.map(day => {
                const slot = slotsByDay[day]?.find(s => 
                  s.startTime === timeSlot.startTime && 
                  s.endTime === timeSlot.endTime
                );

                return (
                  <td key={`${day}-${timeSlot.formatted}`} className="timetable-cell">
                    {slot ? (
                      <div>
                        <strong>{slot.subject || 'N/A'}</strong>
                        <div>{slot.type === 'Lab' ? `Lab ${slot.group || ''}` : 'Lecture'}</div>
                        <div>{slot.room || 'N/A'}</div>
                        <small>{slot.startTime} - {slot.endTime}</small>
                      </div>
                    ) : null}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserTimetable;