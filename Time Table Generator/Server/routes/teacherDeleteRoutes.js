const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const Teacher = require('../models/users');

router.get("/", async (req, res) => {
  try {
    const teachers = await Teacher.find({ role: "teacher" });
    res.json(teachers);
  } catch (err) {
    console.error(err);
    res.status(500).json("Failed to fetch teachers");
  }
});

router.post("/delete", async (req, res) => {
  try {
    const { teachers } = req.body;
    if (!teachers || !Array.isArray(teachers)) {
      return res.status(400).json({ message: "Invalid input" });
    }

    await Teacher.deleteMany({ name: { $in: teachers } });

    res.json({ message: "Teachers deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json("Error deleting teachers");
  }
});

module.exports = router;
