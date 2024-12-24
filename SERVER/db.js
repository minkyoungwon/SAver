const mysql = require("mysql2");
require("dotenv").config();

const db = mysql.createConnection({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "sesac1234!",
  database: process.env.DB_NAME || "board_app",
});

db.connect((err) => {
  if (err) {
    console.error("MySQL 연결 실패:", err);
    return;
  }
  console.log("MySQL 연결 성공");
});

module.exports = db;

//이렇게 했었는데
// // db.js
// const mysql = require('mysql2');
// require('dotenv').config();

// const db = mysql.createConnection({
//   host: process.env.DB_HOST || 'localhost',
//   user: process.env.DB_USER || 'root',
//   password: process.env.DB_PASSWORD || '',
//   database: process.env.DB_NAME || 'board_app',
// });

// db.connect((err) => {
//   if (err) {
//     console.error('MySQL 연결 실패:', err);
//     return;
//   }
//   console.log('MySQL 연결 성공');
// });

// module.exports = db;
