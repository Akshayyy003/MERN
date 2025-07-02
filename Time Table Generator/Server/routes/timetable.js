const express = require('express');
const router = express.Router();
const Timetable = require('../models/TimeTable');


// POST /api/timetable/save
router.post('/save', async (req, res) => {
  try {
    const { branch, semester, createdBy, timetable } = req.body;

    if (!branch || !semester || !timetable || !Array.isArray(timetable)) {
      return res.status(400).json({ error: "Missing or invalid data" });
    }

    // Optional: delete previous timetable for same branch+semester before saving new one
    await Timetable.deleteMany({ branch: branch.toLowerCase(), semester });


    const newTimetable = new Timetable({
      branch: branch.toLowerCase(),
      semester,
      createdBy: createdBy || null,
      timetable,
    });

    await newTimetable.save();

    res.status(201).json({ message: "✅ Timetable saved successfully." });
  } catch (error) {
    console.error("❌ Error saving timetable:", error);
    res.status(500).json({ error: "❌ Server error while saving timetable" });
  }
});

// Assuming this is in your routes file and 'tt' is your Timetable model
router.get('/occupied', async (req, res) => {
  try {
    const { branch, semester, day, startTime, endTime } = req.query;

    if (!branch || !semester || !day || !startTime || !endTime) {
      return res.status(400).json({ message: "Missing required parameters" });
    }

    const timetables = await Timetable.find({
      branch: branch.toLowerCase(),
      semester,
      "timetable.day": day,
      "timetable.startTime": startTime
    });

    const occupiedTeachers = new Set();
    const occupiedRooms = new Set();

    timetables.forEach(doc => {
      doc.timetable.forEach(slot => {
        if (slot.day === day && slot.startTime === startTime) {
          if (slot.teacher) occupiedTeachers.add(slot.teacher);
          if (slot.room) occupiedRooms.add(slot.room);
        }
      });
    });
    

    res.json({
      occupiedTeachers: Array.from(occupiedTeachers),
      occupiedRooms: Array.from(occupiedRooms)
    });
  } catch (err) {
    console.error("Error in /occupied:", err);
    res.status(500).json({ message: "Server error" });
  }
});





// Get all timetables
router.get('/all', async (req, res) => {
  try {
    const all = await Timetable.find({});
    res.json(all);
  } catch (err) {
    console.error("Error fetching timetables:", err);
    res.status(500).json({ error: "Server error while fetching timetables" });
  }
});

// Delete a timetable
router.delete('/:branch/:semester', async (req, res) => {
  try {
    const { branch, semester } = req.params;

    const deleted = await Timetable.deleteMany({
      branch: branch.toLowerCase(),
      semester,
    });

    if (deleted.deletedCount === 0) {
      return res.status(404).json({ message: "No timetable found to delete" });
    }

    res.json({ message: "✅ Timetable deleted successfully" });
  } catch (err) {
    console.error("Error deleting timetable:", err);
    res.status(500).json({ message: "❌ Server error while deleting timetable" });
  }
});

module.exports = router;
