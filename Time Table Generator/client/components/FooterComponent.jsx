import React, { useState } from 'react';
import './css/TimetableBuilder.css';

const FooterComponent = ({ subjectRequirements }) => {
  const [visible, setVisible] = useState(true);

  const isValidData =
    subjectRequirements && typeof subjectRequirements === 'object';

  return (
    <>
      <button
        onClick={() => setVisible(!visible)}
        style={{
          position: "fixed",
          bottom: visible ? "120px" : "20px",
          right: "20px",
          zIndex: 1001,
          padding: "0.5rem 1rem",
          borderRadius: "8px",
          border: "none",
          background: "#444",
          color: "#fff",
          cursor: "pointer"
        }}
      >
        {visible ? "Hide Summary" : "Show Summary"}
      </button>

      {visible && isValidData && (
        <div className="requirements-footer">
          <h4>Subject Requirements</h4>
          <table className="footer-table">
            <thead>
              <tr>
                <th>Subject</th>
                <th>Lectures Left</th>
                <th>Labs Left</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(subjectRequirements).map(([subject, data], idx) => (
                <tr key={idx}>
                  <td>{subject}</td>
                  <td>{data.lec}</td>
                  <td>{data.lab}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
};

export default FooterComponent;
