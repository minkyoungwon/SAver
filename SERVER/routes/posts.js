import express from "express";
import { authenticateToken } from "./auth.js"; // ✅ import 유지
import supabase from "../db.js"; // ✅ Supabase 적용

const router = express.Router();

// 🟢 게시글 작성 API
router.post("/", authenticateToken, async (req, res) => {
  const { title, content } = req.body;
  const userId = req.user.id;
  const author = req.user.email.split("@")[0];

  try {
    const { data, error } = await supabase
      .from("posts")
      .insert([{ title, content, author, user_id: userId }])
      .select("id")
      .single();

    if (error) {
      console.error("❌ 게시글 추가 오류:", error);
      return res.status(500).json({ message: "게시글 작성 중 오류가 발생했습니다." });
    }

    res.status(201).send({ id: data.id, title, content, author });
  } catch (err) {
    console.error("❌ 서버 내부 오류:", err);
    res.status(500).send({ message: "서버 오류가 발생했습니다.", error: err.message });
  }
});

// 🟢 게시글 목록 조회 API
router.get("/", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("posts")
      .select("id, title, user_id, author, posted_at, view_count, is_hidden")
      .order("posted_at", { ascending: false });

    if (error) {
      console.error("❌ 게시글 목록 조회 오류:", error);
      return res.status(500).json({ message: "게시글 목록을 가져오는 중 오류가 발생했습니다." });
    }

    res.send(data);
  } catch (err) {
    console.error("❌ 서버 내부 오류:", err);
    res.status(500).send({ message: "서버 오류가 발생했습니다.", error: err.message });
  }
});

// 🟢 게시글 상세 조회 API
router.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    // 게시글 가져오기
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("❌ 게시글 조회 오류:", error);
      return res.status(404).json({ message: "게시글을 찾을 수 없습니다." });
    }

    // 조회수 증가
    await supabase
      .from("posts")
      .update({ view_count: data.view_count + 1 })
      .eq("id", id);

    res.send(data);
  } catch (err) {
    console.error("❌ 서버 내부 오류:", err);
    res.status(500).send({ message: "서버 오류가 발생했습니다.", error: err.message });
  }
});

// 🟢 게시글 삭제 API
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const { data, error } = await supabase
      .from("posts")
      .delete()
      .eq("id", id)
      .select("*");

    if (error) {
      console.error("❌ 게시글 삭제 오류:", error);
      return res.status(500).json({ message: "게시글 삭제 중 오류가 발생했습니다." });
    }

    if (!data || data.length === 0) {
      return res.status(404).send({ message: "삭제할 게시글이 없습니다." });
    }

    res.status(200).send({ message: "게시글이 삭제되었습니다." });
  } catch (err) {
    console.error("❌ 서버 내부 오류:", err);
    res.status(500).send({ message: "서버 오류가 발생했습니다.", error: err.message });
  }
});

// 🟢 게시글 수정 API
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;

  try {
    const { data, error } = await supabase
      .from("posts")
      .update({ title, content })
      .eq("id", id)
      .select("*");

    if (error) {
      console.error("❌ 게시글 수정 오류:", error);
      return res.status(500).json({ message: "게시글 수정 중 오류가 발생했습니다." });
    }

    if (!data || data.length === 0) {
      return res.status(404).send({ message: "수정할 게시글이 없습니다." });
    }

    res.status(200).send({ message: "게시글이 수정되었습니다." });
  } catch (err) {
    console.error("❌ 서버 내부 오류:", err);
    res.status(500).send({ message: "서버 오류가 발생했습니다.", error: err.message });
  }
});

export default router;
