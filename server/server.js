const express = require("express");
const mysql = require("mysql2");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(bodyParser.json());

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Aravindh003_",
  database: "drone_db",
  port: 3307,
});

db.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL: ", err);
    return;
  }
  console.log("MySQL connected...");
});

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "aravindhofficial96@gmail.com",
    pass: "menz shhv xats ifck",
  },
});

let otps = {};

app.post("/send-otp", (req, res) => {
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

app.post("/register", (req, res) => {
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

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
