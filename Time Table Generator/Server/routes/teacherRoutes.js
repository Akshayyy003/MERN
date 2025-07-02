const express = require('express');
const router = express.Router();
const User = require('../models/users')
const bcrypt = require('bcrypt');
router.post('/add', async (req, res) => {
  try {
    const { name, email, Num, password, branch} = req.body;
    // ✅ Basic validation
    if (!name || !email || !branch || !Num || !password) {
      return res.status(400).json("All fields are required");
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email is already registered" });
    }

    // ✅ Save subject
     const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // ✅ Save new user
    const newUser = await User.create({
      name,
      email,
      Num,
      branch,
      password: hashedPassword
    });
    res.status(201).json({message: "success"});
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json("Internal server error");
  }
});



module.exports = router;
