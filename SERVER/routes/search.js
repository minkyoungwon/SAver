import express from "express";
import supabase from "../db.js"; // ✅ Supabase 적용

const router = express.Router();

// 🟢 게시글 검색 API
router.get("/", async (req, res) => {
    const { query } = req.query;

    if (!query || query.trim() === "") {
        return res.status(400).json({ error: "검색어를 입력해주세요." });
    }

    try {
        const { data, error } = await supabase
            .from("posts")
            .select("id, title, content, author, posted_at")
            .or(`title.ilike.%${query}%,content.ilike.%${query}%,author.ilike.%${query}%`)
            .order("posted_at", { ascending: false });

        if (error) {
            console.error("❌ 게시글 검색 오류:", error);
            return res.status(500).json({ error: "게시글 검색 중 오류가 발생했습니다." });
        }

        res.json(data);
    } catch (err) {
        console.error("❌ 서버 내부 오류:", err);
        res.status(500).json({ error: "서버 오류가 발생했습니다.", message: err.message });
    }
});

export default router;
