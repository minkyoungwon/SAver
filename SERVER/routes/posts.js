// routes/posts.js
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

    if (error || !data) {
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

/* ------------------------------------------
   ▼▼▼ 여기서부터 댓글/대댓글 관련 API ▼▼▼
------------------------------------------ */

// 🟢 댓글 작성 API
router.post("/comments", authenticateToken, async (req, res) => {
  const { postId, content } = req.body;
  const userId = req.user.id; // 토큰에서 유저 id
  if (!content || !postId) {
    return res.status(400).json({ message: "내용과 게시글 ID를 입력하세요." });
  }

  try {
    // posted_at 직접 지정(기존 컬럼에 null이면 정렬 안 될 수 있음)
    const { data, error } = await supabase
      .from("comments")
      .insert([
        {
          post_id: postId,
          user_id: userId,
          content,
          depth: 0,
          parent_id: null,
          posted_at: new Date(), // 직접 시간 기록
        },
      ])
      .select("*")
      .single();

    if (error) {
      console.error("❌ 댓글 작성 오류:", error);
      return res.status(500).json({ message: "댓글 작성 중 오류가 발생했습니다." });
    }

    res.status(201).json(data);
  } catch (err) {
    console.error("❌ 서버 내부 오류:", err);
    res.status(500).send({ message: "서버 오류 발생", error: err.message });
  }
});

// 🟢 대댓글 작성 API
router.post("/comments/reply", authenticateToken, async (req, res) => {
  const { postId, content, parentId } = req.body;
  const userId = req.user.id;

  if (!content || !postId || !parentId) {
    return res.status(400).json({ message: "내용, 게시글 ID, 부모 댓글 ID를 입력하세요." });
  }

  try {
    // 부모 댓글(depth) 확인
    const { data: parentComment, error: parentError } = await supabase
      .from("comments")
      .select("depth")
      .eq("id", parentId)
      .single();

    if (!parentComment) {
      return res.status(404).json({ message: "부모 댓글이 존재하지 않습니다." });
    }

    // 대댓글 작성
    const { data, error } = await supabase
      .from("comments")
      .insert([
        {
          post_id: postId,
          user_id: userId,
          content,
          parent_id: parentId,
          depth: parentComment.depth + 1,
          posted_at: new Date(),
        },
      ])
      .select("*")
      .single();

    if (error) {
      console.error("❌ 대댓글 작성 오류:", error);
      return res.status(500).json({ message: "대댓글 작성 중 오류가 발생했습니다." });
    }

    res.status(201).json(data);
  } catch (err) {
    console.error("❌ 서버 내부 오류:", err);
    res.status(500).send({ message: "서버 오류 발생", error: err.message });
  }
});

// 🟢 댓글 조회 API (작성자 email JOIN)
router.get("/comments/:postId", async (req, res) => {
  const { postId } = req.params;

  try {
    // 'users' 테이블에서 email 가져오기:  .select("*, users(email)")와 같이 가능
    const { data, error } = await supabase
      .from("comments")
      .select(`
        *,
        users (
          email
        )
      `)
      .eq("post_id", postId)
      .order("posted_at", { ascending: true });

    if (error) {
      console.error("❌ 댓글 조회 오류:", error);
      return res.status(500).json({ message: "댓글 조회 중 오류가 발생했습니다." });
    }

    res.json(data);
  } catch (err) {
    console.error("❌ 서버 내부 오류:", err);
    res.status(500).send({ message: "서버 오류 발생", error: err.message });
  }
});

// 🟢 댓글 수정 API
router.put("/comments/:commentId", authenticateToken, async (req, res) => {
  const { commentId } = req.params;
  const { content } = req.body;
  const userId = req.user.id;

  if (!content) {
    return res.status(400).json({ message: "수정할 내용을 입력하세요." });
  }

  try {
    // 1) 수정 대상 댓글이 존재하는지, 작성자 본인인지 확인
    const { data: existing, error: fetchError } = await supabase
      .from("comments")
      .select("user_id")
      .eq("id", commentId)
      .single();

    if (!existing) {
      return res.status(404).json({ message: "수정할 댓글이 없습니다." });
    }
    if (existing.user_id !== userId) {
      return res.status(403).json({ message: "본인 댓글만 수정할 수 있습니다." });
    }

    // 2) 수정
    const { data, error } = await supabase
      .from("comments")
      .update({ content })
      .eq("id", commentId)
      .select("*")
      .single();

    if (error) {
      console.error("❌ 댓글 수정 오류:", error);
      return res.status(500).json({ message: "댓글 수정 중 오류가 발생했습니다." });
    }

    res.json(data);
  } catch (err) {
    console.error("❌ 서버 내부 오류:", err);
    res.status(500).json({ message: "서버 오류 발생", error: err.message });
  }
});

// 🟢 댓글 삭제 API
router.delete("/comments/:commentId", authenticateToken, async (req, res) => {
  const { commentId } = req.params;
  const userId = req.user.id;

  try {
    // 1) 본인 댓글인지 확인
    const { data: existing, error: fetchError } = await supabase
      .from("comments")
      .select("user_id")
      .eq("id", commentId)
      .single();

    if (!existing) {
      return res.status(404).json({ message: "이미 삭제되었거나 존재하지 않는 댓글입니다." });
    }
    if (existing.user_id !== userId) {
      return res.status(403).json({ message: "본인 댓글만 삭제할 수 있습니다." });
    }

    // 2) 삭제
    const { data, error } = await supabase
      .from("comments")
      .delete()
      .eq("id", commentId)
      .select("*");

    if (error) {
      console.error("❌ 댓글 삭제 오류:", error);
      return res.status(500).json({ message: "댓글 삭제 중 오류가 발생했습니다." });
    }

    res.json({ message: "댓글이 삭제되었습니다." });
  } catch (err) {
    console.error("❌ 서버 내부 오류:", err);
    res.status(500).json({ message: "서버 오류 발생", error: err.message });
  }
});

export default router;
