import express from "express";
import { authenticateToken } from "./auth.js"; // ✅ import 방식 유지
import supabase from "../db.js"; // ✅ Supabase 적용

const router = express.Router();

// 🟢 유저 검색 API (ILIKE 적용)
router.get("/search", authenticateToken, async (req, res) => {
  const { query } = req.query;
  console.log("검색 요청 결과값 => :", query);

  if (!query) {
    return res.status(400).send({ message: "검색어를 입력하세요." });
  }

  try {
    const { data, error } = await supabase
      .from("users")
      .select("id, email")
      .ilike("email", `%${query}%`);

    if (error) {
      console.error("❌ Supabase 검색 오류:", error);
      return res.status(500).json({ message: "유저 검색 중 오류가 발생했습니다.", error });
    }

    res.json(data);
  } catch (err) {
    console.error("❌ 서버 내부 오류:", err);
    res.status(500).send({ message: "서버 오류가 발생했습니다.", error: err.message });
  }
});

// 🟢 메시지 보내기 및 저장 (RETURNING id 적용)
router.post("/send", authenticateToken, async (req, res) => {
  const { receiverId, content } = req.body;
  const senderEmail = req.user.email;

  if (!receiverId || !content) {
    return res.status(400).send({ message: "수신자와 내용을 확인하세요." });
  }

  try {
    const { data, error } = await supabase
      .from("dm_direct_messages")
      .insert([{ sender_id: senderEmail, receiver_id: receiverId, content }])
      .select("id")
      .single();

    if (error) {
      console.error("❌ 메시지 저장 오류:", error);
      return res.status(500).json({ message: "메시지 저장 중 오류가 발생했습니다." });
    }

    res.status(201).send({
      message: "메시지가 성공적으로 저장되었습니다.",
      data: {
        id: data.id,
        senderEmail,
        receiverId,
        content,
      },
    });
  } catch (err) {
    console.error("❌ 서버 내부 오류:", err);
    res.status(500).send({ message: "서버 오류가 발생했습니다.", error: err.message });
  }
});

// 🟢 대화 기록 조회 API
router.get("/:receiverEmail", authenticateToken, async (req, res) => {
  const senderEmail = req.user.email;
  const { receiverEmail } = req.params;

  try {
    const { data, error } = await supabase
      .from("dm_direct_messages")
      .select("sender_id, receiver_id, content, sent_at")
      .or(`sender_id.eq.${senderEmail},receiver_id.eq.${receiverEmail}`)
      .or(`sender_id.eq.${receiverEmail},receiver_id.eq.${senderEmail}`)
      .order("sent_at", { ascending: true });

    if (error) {
      console.error("❌ 대화 조회 오류:", error);
      return res.status(500).json({ message: "대화 기록 조회 중 오류가 발생했습니다." });
    }

    res.send(data);
  } catch (err) {
    console.error("❌ 서버 내부 오류:", err);
    res.status(500).send({ message: "서버 오류가 발생했습니다.", error: err.message });
  }
});

// 🟢 읽음 상태 업데이트 (`count` 활용)
router.put("/read/:receiverId", authenticateToken, async (req, res) => {
  const senderId = req.user.id;
  const { receiverId } = req.params;

  try {
    const { data, error } = await supabase
      .from("dm_direct_messages")
      .update({ is_read: true })
      .eq("sender_id", receiverId)
      .eq("receiver_id", senderId)
      .select("*");

    if (error) {
      console.error("❌ 읽음 상태 업데이트 오류:", error);
      return res.status(500).json({ message: "읽음 상태 업데이트 중 오류가 발생했습니다." });
    }

    if (!data || data.length === 0) {
      return res.status(404).send({ message: "업데이트할 메시지가 없습니다." });
    }

    res.send({ message: "읽음 상태가 업데이트되었습니다." });
  } catch (err) {
    console.error("❌ 서버 내부 오류:", err);
    res.status(500).send({ message: "서버 오류가 발생했습니다.", error: err.message });
  }
});

export default router;
