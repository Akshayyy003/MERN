const express = require('express');
const router = express.Router();
const Subject = require('../models/subjects')

router.post('/add', async (req, res) => {
  try {
    const { subName, subCode, branch, semester, lec, lab } = req.body;

    // ✅ Basic validation
    if (!subName || !subCode || !branch || !semester || lec == null || lab == null) {
      return res.status(400).json("All fields are required");
    }

    // ✅ Save subject
    const newSubject = await Subject.create({ subName, subCode, branch, semester, lec, lab });
    res.json("success"); // You can also send the newSubject if needed
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json("Internal server error");
  }
});



module.exports = router;
