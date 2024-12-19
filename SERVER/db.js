const mysql = require('mysql2');
require('dotenv').config();

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '0000',  // 비밀번호 확인
  database: 'board_app'       // 'boadr_app' 대신 'board_app'으로 수정
});

db.connect((err) => {
  if (err) {
    console.error('MySQL 연결 실패:', err);
    return;
  }
  console.log('MySQL 연결 성공');
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
