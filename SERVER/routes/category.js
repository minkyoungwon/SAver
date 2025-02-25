import express from "express";
import { authenticateToken } from "./auth.js"; // ✅ import 방식 유지
import supabase from "../db.js"; // ✅ Supabase 적용

const router = express.Router();

// 🟢 사용자의 카테고리 목록 조회 API
router.get("/", authenticateToken, async (req, res) => {
  const userId = req.user.id;

  try {
    const { data, error } = await supabase
      .from("coupon_categories")
      .select("*")
      .eq("user_id", userId);

    if (error) {
      console.error("❌ Supabase 조회 오류:", error);
      return res.status(500).json({ message: "카테고리 조회 중 오류가 발생했습니다.", error });
    }

    res.json(data);
  } catch (err) {
    console.error("❌ 서버 내부 오류:", err);
    res.status(500).send({ message: "서버 오류가 발생했습니다.", error: err.message });
  }
});

// 🟢 새 카테고리 추가 API
router.post("/", authenticateToken, async (req, res) => {
  const userId = req.user.id;
  const { name } = req.body;

  if (!name.trim()) {
    return res.status(400).send({ message: "카테고리 이름을 입력하세요." });
  }

  try {
    // 카테고리 중복 체크
    const { count, error: checkError } = await supabase
      .from("coupon_categories")
      .select("id", { count: "exact" })
      .eq("name", name)
      .eq("user_id", userId);

    if (checkError) {
      console.error("❌ 중복 체크 오류:", checkError);
      return res.status(500).json({ message: "카테고리 중복 체크 중 오류가 발생했습니다." });
    }

    if (count > 0) {
      return res.status(400).send({ message: "이미 존재하는 카테고리입니다." });
    }

    // 카테고리 추가
    const { data, error } = await supabase
      .from("coupon_categories")
      .insert([{ name, user_id: userId }])
      .select("id")
      .single();

    if (error) {
      console.error("❌ 카테고리 추가 오류:", error);
      return res.status(500).json({ message: "카테고리 추가 중 오류가 발생했습니다." });
    }

    res.status(201).send({ message: "카테고리가 추가되었습니다.", id: data.id });
  } catch (err) {
    console.error("❌ 서버 내부 오류:", err);
    res.status(500).send({ message: "서버 오류가 발생했습니다.", error: err.message });
  }
});

// 🟢 카테고리 삭제 API
router.delete("/:id", authenticateToken, async (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;

  try {
    const { data, error } = await supabase
      .from("coupon_categories")
      .delete()
      .eq("id", id)
      .eq("user_id", userId)
      .select("*"); // 삭제된 데이터 확인

    if (error) {
      console.error("❌ 카테고리 삭제 오류:", error);
      return res.status(500).json({ message: "카테고리 삭제 중 오류가 발생했습니다." });
    }

    if (!data || data.length === 0) {
      return res.status(404).send({ message: "삭제할 카테고리가 없습니다." });
    }

    res.status(200).send({ message: "카테고리가 삭제되었습니다." });
  } catch (err) {
    console.error("❌ 서버 내부 오류:", err);
    res.status(500).send({ message: "서버 오류가 발생했습니다.", error: err.message });
  }
});

export default router;
