const mysql = require("mysql2");
require("dotenv").config();

const db = mysql.createConnection({
  host: process.env.DB_HOST || "34.228.198.11 ",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "sesac1234!",
  database: process.env.DB_NAME || "test_mkw_db"
});

db.connect((err) => {
  if (err) {
    console.error("MySQL 연결 실패:", err);
    return;
  }
  console.log("MySQL 연결 성공");
});

module.exports = db;
