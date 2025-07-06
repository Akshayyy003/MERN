const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/users');

router.post('/', async (req, res) => {
  try {
    const { email, password } = req.body;

    // ✅ Basic validation
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    // ✅ Normalize and find user
    const user = await User.findOne({ email: email.trim().toLowerCase() });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // ✅ Compare hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Incorrect password" });
    }

    // ✅ Success response (omit password)
    res.status(200).json({
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        branch: user.branch,
        Num: user.Num,
        role: user.role
      }
    });

  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
