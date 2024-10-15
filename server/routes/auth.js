const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const router = express.Router();
const db = require("../config/db");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "aravindhofficial96@gmail.com",
    pass: "menz shhv xats ifck",
  },
});

let otps = {};

router.post("/send-otp", (req, res) => {
  const { email } = req.body;

  const otp = Math.floor(100000 + Math.random() * 900000);
  otps[email] = otp;

  const mailOptions = {
    from: "iamk.aravindhan@gmail.com",
    to: email,
    subject: "Your OTP Code",
    text: `Your OTP is ${otp}`,
  };

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      return res.status(500).json({ error: "Error sending OTP" });
    }
    res.status(200).json({ message: "OTP sent" });
  });
});

router.post("/register", (req, res) => {
  const { username, email, mobile, password, otp } = req.body;

  if (otps[email] !== parseInt(otp)) {
    return res.status(400).json({ error: "Invalid OTP" });
  }

  bcrypt.hash(password, 10, (err, hashedPassword) => {
    if (err) {
      return res.status(500).json({ error: "Error hashing password" });
    }

    const sql = `INSERT INTO users (username, email, mobile, password) VALUES (?, ?, ?, ?)`;
    db.query(sql, [username, email, mobile, hashedPassword], (err, result) => {
      if (err) {
        return res.status(500).json({ error: "Error inserting user data" });
      }
      delete otps[email];
      res.status(200).json({ message: "User registered successfully" });
    });
  });
});

router.post("/login", (req, res) => {
  const { username, password } = req.body;
  const query = "SELECT * FROM users WHERE username = ?";

  db.query(query, [username], async (err, result) => {
    if (err) return res.status(500).json({ msg: "Error logging in" });
    if (
      !result.length ||
      !(await bcrypt.compare(password, result[0].password))
    ) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    const token = jwt.sign({ id: result[0].id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.json({ token });
  });
});

router.post("/forgot-password", (req, res) => {
  const { email } = req.body;

  const query = "SELECT * FROM users WHERE email = ?";

  db.query(query, [email], (err, result) => {
    if (err) {
      return res.status(500).json({ msg: "Error querying the database" });
    }

    if (!result.length) {
      return res
        .status(400)
        .json({ msg: "No account associated with this email" });
    }

    const resetToken = jwt.sign({ id: result[0].id }, process.env.JWT_SECRET, {
      expiresIn: "15m",
    });

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "aravindhofficial96@gmail.com",
        pass: "menz shhv xats ifck",
      },
    });

    transporter.sendMail(
      {
        to: email,
        subject: "Password Reset",
        text: `Click the link to reset your password: ${process.env.CLIENT_URL}/reset-password/${resetToken}`,
      },
      (error, info) => {
        if (error) {
          return res.status(500).json({ msg: "Failed to send email" });
        }
        res.json({ msg: "Password reset email sent successfully" });
      }
    );
  });
});

router.post("/reset-password", async (req, res) => {
  const { token, newPassword } = req.body;
  if (!token || !newPassword) {
    return res.status(400).json({ msg: "Token and new password are required" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const query = "UPDATE users SET password = ? WHERE id = ?";
    db.query(query, [hashedPassword, decoded.id], (err, result) => {
      if (err) return res.status(500).json({ msg: "Error resetting password" });
      res.json({ msg: "Password updated" });
    });
  } catch (err) {
    res.status(400).json({ msg: "Invalid or expired token" });
  }
});

module.exports = router;
