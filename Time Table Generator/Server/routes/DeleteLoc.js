const express = require('express');
const router = express.Router();
const LabClass = require('../models/LabClass');

// models/labClass.js
// Schema should include a 'type' field like: "lab" or "class"

router.get("/", async (req, res) => {
  try {
    const allItems = await LabClass.find(); // Model that stores both labs and classes
    res.json(allItems);
  } catch (err) {
    console.error("Fetch error:", err);
    res.status(500).json("Failed to fetch items");
  }
});

router.post("/delete", async (req, res) => {
  try {
    const { items } = req.body;

    if (!items || !Array.isArray(items)) {
      return res.status(400).json({ message: "Invalid input" });
    }

    await LabClass.deleteMany({ branch: { $in: items } });

    res.json({ message: "Labs and classes deleted successfully" });
  } catch (err) {
    console.error("Delete error:", err);
    res.status(500).json("Internal server error");
  }
});


module.exports = router;