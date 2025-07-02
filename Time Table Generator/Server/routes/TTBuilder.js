const express = require('express');
const router = express.Router();
const users = require('../models/users');
const loc = require("../models/LabClass")
const subject = require("../models/subjects")
const TS = require("../models/timeSlots")
const tt = require("../models/TimeTable")

router.get('/config/:branch', async (req, res) => {
  try {
    const branch = req.params.branch;
    const config = await TS.findOne({ branch: branch.trim().toLowerCase() });

    if (!config) {
      return res.status(404).json("❌ No Time slots found for this branch");
    }

    res.json(config);
  } catch (err) {
    console.error("Error fetching Time slots:", err);
    res.status(500).json("❌ Internal server error");
  }
});

router.get('/options/:branch/:semester', async (req, res) => {
  const branch = req.params.branch.toLowerCase();
  const semester = parseInt(req.params.semester);

  try {
    const teachersRaw = await users.find({ branch, role: "teacher" });
    const subjectsRaw = await subject.find({ branch, semester });
    const locationsRaw = await loc.find({ branch });

    const teachers = teachersRaw.map((t) => t.name); // get only names
    const subjects = subjectsRaw.map((s) => s.subName); // get only subject names

    // Flatten labs + classes into one list
    const locations = [];
    locationsRaw.forEach((location) => {
      const prefix = location.prefix;
      const labs = parseInt(location.numberOfLabs);
      const classes = parseInt(location.numberOfClasses);

      for (let i = 1; i <= labs; i++) {
        locations.push(`${prefix}L${i}`);
      }
      for (let i = 1; i <= classes; i++) {
        locations.push(`${prefix}C${i}`);
      }
    });

    res.json({
      teachers,
      subjects,
      locations,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json("Server error while fetching options.");
  }
});



module.exports = router;
