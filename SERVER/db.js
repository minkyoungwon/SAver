import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
dotenv.config();

// ✅ Supabase 클라이언트 설정
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

// ✅ 연결 확인
(async () => {
  const { data, error } = await supabase.from("users").select("*").limit(1);
  if (error) {
    console.error("❌ Supabase 연결 실패:", error);
  } else {
    console.log("✅ Supabase 연결 성공! 사용자 데이터:", data);
  }
})();

export default supabase;
