

const { Pool } = require("pg");
require("dotenv").config();


const pool = new Pool({
  connectionString: process.env.SUPABASE_CONNECTION_STRING,
    // 또는 host/user/password/database 설정을 별도 기입할 수도 있음
  // host: process.env.SUPABASE_HOST,
  // port: process.env.SUPABASE_PORT,
  // user: process.env.SUPABASE_USER,
  // password: process.env.SUPABASE_PASSWORD,
  // database: process.env.SUPABASE_DATABASE,
  ssl: {
    rejectUnauthorized: false, // Render의 PostgreSQL 연결 시 필요
  },
});

// DB 연결 테스트
pool
  .connect()
  .then(() => console.log("✅ PostgreSQL 연결 성공!"))
  .catch((err) => console.error("❌ PostgreSQL 연결 실패:", err));

//console.log("🔍 연결 문자열:", process.env.SUPABASE_CONNECTION_STRING);
module.exports = pool;
