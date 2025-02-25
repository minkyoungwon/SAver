import express from "express";
import { authenticateToken } from "./auth.js"; // ✅ import 유지
import supabase from "../db.js"; // ✅ Supabase 적용

const router = express.Router();

// 🟢 사용자의 쿠폰 목록 조회 API
router.get("/", authenticateToken, async (req, res) => {
  const userId = req.user.id;

  try {
    const { data, error } = await supabase
      .from("coupons")
      .select("*")
      .eq("user_id", userId)
      .order("deadline", { ascending: true });

    if (error) {
      console.error("❌ 쿠폰 조회 오류:", error);
      return res.status(500).json({ message: "쿠폰 조회 중 오류가 발생했습니다." });
    }

    res.json(data);
  } catch (err) {
    console.error("❌ 서버 내부 오류:", err);
    res.status(500).send({ message: "서버 오류가 발생했습니다.", error: err.message });
  }
});

// 🟢 새 쿠폰 추가 API
router.post("/", authenticateToken, async (req, res) => {
  const userId = req.user.id;
  const { name, usageLocation, note, deadline } = req.body;

  try {
    const { data, error } = await supabase
      .from("coupons")
      .insert([{ name, usage_location: usageLocation, note, deadline, user_id: userId }])
      .select("id")
      .single();

    if (error) {
      console.error("❌ 쿠폰 추가 오류:", error);
      return res.status(500).json({ message: "쿠폰 추가 중 오류가 발생했습니다." });
    }

    res.status(201).send({ message: "쿠폰이 추가되었습니다.", id: data.id });
  } catch (err) {
    console.error("❌ 서버 내부 오류:", err);
    res.status(500).send({ message: "서버 오류가 발생했습니다.", error: err.message });
  }
});

// 🟢 쿠폰 수정 API
router.put("/:id", authenticateToken, async (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;
  const { name, usageLocation, note, deadline } = req.body;

  try {
    const { data, error } = await supabase
      .from("coupons")
      .update({ name, usage_location: usageLocation, note, deadline })
      .eq("id", id)
      .eq("user_id", userId)
      .select("*");

    if (error) {
      console.error("❌ 쿠폰 수정 오류:", error);
      return res.status(500).json({ message: "쿠폰 수정 중 오류가 발생했습니다." });
    }

    if (!data || data.length === 0) {
      return res.status(404).send({ message: "수정할 쿠폰이 없습니다." });
    }

    res.status(200).send({ message: "쿠폰이 수정되었습니다." });
  } catch (err) {
    console.error("❌ 서버 내부 오류:", err);
    res.status(500).send({ message: "서버 오류가 발생했습니다.", error: err.message });
  }
});

// 🟢 쿠폰 삭제 API
router.delete("/:id", authenticateToken, async (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;

  try {
    const { data, error } = await supabase
      .from("coupons")
      .delete()
      .eq("id", id)
      .eq("user_id", userId)
      .select("*");

    if (error) {
      console.error("❌ 쿠폰 삭제 오류:", error);
      return res.status(500).json({ message: "쿠폰 삭제 중 오류가 발생했습니다." });
    }

    if (!data || data.length === 0) {
      return res.status(404).send({ message: "삭제할 쿠폰이 없습니다." });
    }

    res.status(200).send({ message: "쿠폰이 삭제되었습니다." });
  } catch (err) {
    console.error("❌ 서버 내부 오류:", err);
    res.status(500).send({ message: "서버 오류가 발생했습니다.", error: err.message });
  }
});

export default router;
