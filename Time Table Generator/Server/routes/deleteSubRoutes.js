const express = require('express');
const router = express.Router();
const Subject = require('../models/subjects');

router.post("/delete-selected-subjects", async (req, res) => {
  try {
    const { subjects } = req.body;

    if (!Array.isArray(subjects) || subjects.length === 0) {
      return res.status(400).json({ message: "No subjects provided" });
    }

    await Subject.deleteMany({ subName: { $in: subjects } });

    res.json({ message: "Subjects deleted" });
  } catch (err) {
    console.error("Delete error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});
module.exports = router;