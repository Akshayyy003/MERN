const express = require('express');
const router = express.Router();
const Subject = require('../models/subjects'); // Adjust path as needed

// Get all subjects
router.get('/subjects', async (req, res) => {
  try {
    const subjects = await Subject.find({}, { subName: 1, subCode:1 ,branch:1, _id: 0 }); // Only return subName
    res.json(subjects);
  } catch (err) {
    console.error("Error fetching subjects:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
