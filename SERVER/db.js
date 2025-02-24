const { Pool } = require('pg'); // pg 라이브러리
require("dotenv").config();

const pool = new Pool({
  connectionString: process.env.SUPABASE_CONNECTION_STRING,
  // 또는 host/user/password/database 설정을 별도 기입할 수도 있음
  // host: process.env.SUPABASE_HOST,
  // port: process.env.SUPABASE_PORT,
  // user: process.env.SUPABASE_USER,
  // password: process.env.SUPABASE_PASSWORD,
  // database: process.env.SUPABASE_DATABASE,
});

pool.connect((err) => {
  if (err) {
    console.error("PostgreSQL(Supabase) 연결 실패:", err);
    return;
  }
  console.log("PostgreSQL(Supabase) 연결 성공");
});

module.exports = pool;



// 기존 서버를 aws ec2로 하여서 mysql 을 사용할 경우 사용하던 레거시코드들
// const mysql = require("mysql2");
// require("dotenv").config();

// const db = mysql.createConnection({
//   host: process.env.DB_HOST,
//   user: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   database: process.env.DB_NAME,
// });

// db.connect((err) => {
//   if (err) {
//     console.error("MySQL 연결 실패:", err);
//     return;
//   }
//   console.log("MySQL 연결 성공");
// });

// module.exports = db;
