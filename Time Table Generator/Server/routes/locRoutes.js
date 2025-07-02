const express = require('express');
const router = express.Router();
const Location = require('../models/LabClass')

router.post('/add', async (req, res) => {
  try {
    const { branch, prefix, numberOfLabs, numberOfClasses} = req.body;
    // ✅ Basic validation
    if (!branch || !prefix || !numberOfLabs || !numberOfClasses ) {
      return res.status(400).json("All fields are required");
    }
    const existingBranch = await Location.findOne({ branch });
    if (existingBranch) {
      return res.status(400).json({ message: "Branch is already registered" });
    }


    // ✅ Save new Locations
    const newUser = await Location.create({
      branch,
      prefix,
      numberOfLabs,
      branch,
      numberOfClasses
    });
    res.status(201).json({message: "success"});
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json("Internal server error");
  }
});



module.exports = router;
