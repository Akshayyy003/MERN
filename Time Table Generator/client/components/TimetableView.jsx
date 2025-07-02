import React, { useEffect, useState } from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import './css/TimetableView.css';
import axios from 'axios';

const TimetableView = () => {
  const [allTimetables, setAllTimetables] = useState([]);

  useEffect(() => {
    const fetchTimetables = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/timetable/all");
        setAllTimetables(res.data);
      } catch (err) {
        console.error("Failed to fetch timetables", err);
        alert("❌ Failed to fetch timetables from server");
      }
    };

    fetchTimetables();
  }, []);

  const handleDownload = (timetableData) => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text(`Timetable - ${timetableData.branch} - ${timetableData.semester}`, 14, 20);

    const startX = 14;
    const startY = 35;
    const pageWidth = doc.internal.pageSize.width;
    const availableWidth = pageWidth - (startX * 2);

    const headers = ['Time', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const rows = generate2DArrayFromFlat(timetableData.timetable);

    const colWidth = availableWidth / headers.length;
    const rowHeight = 10;
    let currentY = startY;

    const drawCell = (x, y, width, height, text, isHeader = false) => {
      // Draw border
      doc.rect(x, y, width, height);

      // Fill header background
      if (isHeader) {
        doc.setFillColor(211, 47, 47);
        doc.rect(x, y, width, height, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFont(undefined, 'bold');
      } else {
        doc.setFillColor(255, 255, 255);
        doc.setTextColor(0, 0, 0);
        doc.setFont(undefined, 'normal');
      }

      doc.setFontSize(9);

      const textLines = doc.splitTextToSize(text, width - 2); // wrap text
      const lineHeight = 3.5;
      const offsetY = (height - textLines.length * lineHeight) / 2;

      textLines.forEach((line, i) => {
        const textWidth = doc.getTextWidth(line);
        const textX = x + (width - textWidth) / 2;
        const textY = y + offsetY + (i * lineHeight) + 2.5;
        doc.text(line, textX, textY);
      });
    };


    headers.forEach((header, index) => {
      drawCell(startX + (index * colWidth), currentY, colWidth, rowHeight, header, true);
    });
    currentY += rowHeight;

    rows.forEach((row, rowIndex) => {
      if (rowIndex % 2 === 0) {
        doc.setFillColor(248, 248, 248);
        doc.rect(startX, currentY, availableWidth, rowHeight, 'F');
      }

      row.forEach((cell, cellIndex) => {
        drawCell(startX + (cellIndex * colWidth), currentY, colWidth, rowHeight, String(cell || ''));
      });

      currentY += rowHeight;

      if (currentY > doc.internal.pageSize.height - 20) {
        doc.addPage();
        currentY = 20;
      }
    });

    doc.save(`Timetable_${timetableData.branch}_${timetableData.semester}.pdf`);
  };

  const handleDelete = async (branch, semester) => {
    if (!window.confirm(`Are you sure you want to delete the timetable for ${branch} - ${semester}?`)) return;

    try {
      await axios.delete(`http://localhost:5000/api/timetable/${branch}/${semester}`);
      alert(`✅ Deleted timetable for ${branch} - ${semester}`);

      // Refresh UI
      setAllTimetables(prev =>
        prev.filter(item => item.branch !== branch || item.semester !== semester)
      );
    } catch (err) {
      console.error("Failed to delete timetable", err);
      alert("❌ Failed to delete timetable");
    }
  };

  const generate2DArrayFromFlat = (flatData) => {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const uniqueTimes = [...new Set(flatData.map(slot => {
      if (slot.type === "Break") return `Break (${slot.startTime} - ${slot.endTime})`;
      return `${slot.startTime} - ${slot.endTime}`;
    }))];

    const timetableMap = {};
    uniqueTimes.forEach(time => {
      timetableMap[time] = {};
      days.forEach(day => {
        timetableMap[time][day] = "";
      });
    });

    flatData.forEach(slot => {
      const time = slot.type === "Break"
        ? `Break (${slot.startTime} - ${slot.endTime})`
        : `${slot.startTime} - ${slot.endTime}`;
      if (slot.type === "Break") {
        days.forEach(day => {
          timetableMap[time][day] = "Break";
        });
      } else if (slot.type === "Lecture") {
        timetableMap[time][slot.day] = `${slot.subject} (${slot.teacher})`;
      } else if (slot.type === "Lab") {
        timetableMap[time][slot.day] += `Lab(${slot.subject})-${slot.group} `;
      }
    });

    return uniqueTimes.map(time => [time, ...days.map(day => timetableMap[time][day] || "")]);
  };

  return (
    <div className="timetable-view">
      <h2>All Timetables</h2>

      {allTimetables.map((timetableData, index) => (
        <div key={index} className="timetable-entry">
          <p><strong>Branch:</strong> {timetableData.branch}</p>
          <p><strong>Semester:</strong> {timetableData.semester}</p>

          <div className="button-group">
            <button className="btn btn-view" onClick={() => handleDownload(timetableData)}>View (Download PDF)</button>
            <button className="btn btn-delete" onClick={() => handleDelete(timetableData.branch, timetableData.semester)}>Delete</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TimetableView;
