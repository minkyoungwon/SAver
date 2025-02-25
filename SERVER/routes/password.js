import express from "express";
import bcrypt from "bcrypt";
import { authenticateToken } from "../routes/auth.js"; // ✅ 경로 유지
import supabase from "../db.js"; // ✅ Supabase 적용

const router = express.Router();

// 🟢 비밀번호 변경 API
router.put("/change", authenticateToken, async (req, res) => {
  const userId = req.user.id; // authenticateToken이 추가한 user 정보
  const { currentPassword, newPassword } = req.body;

  try {
    // 1️⃣ 현재 비밀번호 조회
    const { data: user, error: fetchError } = await supabase
      .from("users")
      .select("password")
      .eq("id", userId)
      .single();

    if (fetchError) {
      console.error("❌ 비밀번호 조회 오류:", fetchError);
      return res.status(500).json({ message: "사용자 정보를 가져오는 중 오류가 발생했습니다." });
    }

    if (!user) {
      return res.status(404).send({ message: "사용자를 찾을 수 없습니다." });
    }

    const hashedPassword = user.password;

    // 2️⃣ 비밀번호 비교
    const isMatch = await bcrypt.compare(currentPassword, hashedPassword);
    if (!isMatch) {
      return res.status(400).send({ message: "현재 비밀번호가 일치하지 않습니다." });
    }

    // 3️⃣ 새 비밀번호 해싱 후 업데이트
    const newHashedPassword = await bcrypt.hash(newPassword, 10);
    const { error: updateError } = await supabase
      .from("users")
      .update({ password: newHashedPassword })
      .eq("id", userId);

    if (updateError) {
      console.error("❌ 비밀번호 업데이트 오류:", updateError);
      return res.status(500).json({ message: "비밀번호 변경 중 오류가 발생했습니다." });
    }

    res.send({ message: "비밀번호가 성공적으로 변경되었습니다." });
  } catch (error) {
    console.error("❌ 서버 내부 오류:", error);
    res.status(500).send({ message: "서버 오류가 발생했습니다.", error: error.message });
  }
});

export default router;
