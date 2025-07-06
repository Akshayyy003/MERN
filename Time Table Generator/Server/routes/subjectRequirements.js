const express = require('express');
const router = express.Router();
const Subject = require('../models/subjects');

// GET /api/subject-requirements/:branch/:semester
router.get('/:branch/:semester', async (req, res) => {
  const { branch, semester } = req.params;

  try {
    const subjects = await Subject.find({ branch: branch.toLowerCase() , semester });
    const requirements = {};
    subjects.forEach(s => {
      requirements[s.subName] = {
        subCode: s.subCode,
        lec: s.lec,
        lab: s.lab
      };
    });
    console.log(subjects);

    res.json({ requirements });
  } catch (err) {
    console.error("Error fetching subject requirements:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
