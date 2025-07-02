import React, { useEffect, useState } from "react";
import axios from "axios";
import "./css/Subject.css"; // Reusing ring and input styles

const DeleteLabsAndClasses = () => {
  const [items, setItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/labs-classes") // Adjust this route to match your backend
      .then((res) => setItems(res.data))
      .catch((err) => console.error("Fetch error:", err));
  }, []);

  const handleSelectChange = (e) => {
    const selected = Array.from(e.target.selectedOptions).map((opt) => opt.value);
    setSelectedItems(selected);
  };

  const handleDelete = async () => {
    if (selectedItems.length === 0) {
      return alert("⚠️ Please select at least one lab or class to delete.");
    }

    const confirmDelete = window.confirm(
      `Are you sure you want to delete ${selectedItems.length} item(s)?`
    );
    if (!confirmDelete) return;

    try {
      await axios.post("http://localhost:5000/api/labs-classes/delete", {
        items: selectedItems,
      });

      alert("✅ Selected labs/classes deleted!");

      // Update UI
      setItems(items.filter(item => !selectedItems.includes(item.branch)));
      setSelectedItems([]);
    } catch (err) {
      console.error("Delete error:", err);
      alert("❌ Failed to delete selected items.");
    }
  };

  return (
    <div className="main">
      <div className="ring">
        <i style={{ "--clr": "#00ff0a" }}></i>
        <i style={{ "--clr": "#ff0057" }}></i>
        <i style={{ "--clr": "#fffd44" }}></i>
        <div className="login">
          <h2>Delete Labs & Classes</h2>

          <div className="inputBx">
            <select
              multiple
              value={selectedItems}
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
              {items.map((item, index) => (
                <option key={index} value={item.branch}>
                  {item.branch}
                </option>
              ))}
            </select>
          </div>

          <div className="inputBx">
            <input type="button" value="Delete Selected Branches Data" onClick={handleDelete} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteLabsAndClasses;
