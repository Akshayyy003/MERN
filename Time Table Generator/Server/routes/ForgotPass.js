const express = require("express");
const router = express.Router();
const User = require("../models/users"); // your user model
const nodemailer = require("nodemailer");
const { hash } = require("bcryptjs");

const generateRandomPassword = (length = 8) => {
  const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#";
  let password = "";
  for (let i = 0; i < length; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
};

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "akshaymaheta3@gmail.com",         // 🔒 Your sender email
    pass: "xksu lznf pqek wjwt",            // 🔒 App password (not your real password)
  },
});

// 🔁 Route
router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) return res.status(404).json({ message: "User not found" });

    const newPass = generateRandomPassword();
    const hashedPass = await hash(newPass, 10);

    user.password = hashedPass;
    await user.save();

    const mailOptions = {
      from: "akshaymaheta3@gmail.com",
      to: user.email,
      subject: "🔐 Your New Password",
      text: `Hello ${user.name},\n\nYour new password is: ${newPass}\n\nPlease login and change it immediately.`,
    };

    await transporter.sendMail(mailOptions);
    res.json({ message: "✅ New password sent to your email." });
  } catch (err) {
    console.error("Forgot password error:", err);
    res.status(500).json({ message: "❌ Failed to send email." });
  }
});

module.exports = router;
