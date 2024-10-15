const mysql = require("mysql2");
require("dotenv").config();

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

module.exports = db;
