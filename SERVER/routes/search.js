const express = require('express');
const router = express.Router();
const db = require('../db');

// 검색 엔드포인트 추가 (PostgreSQL 적용)
router.get("/", async (req, res) => {
    const { query } = req.query;

    if (!query) {
        return res.status(400).json({ error: "검색어를 입력해주세요." });
    }

    const sqlQuery = `
        SELECT id, title, content, author, 
        TO_CHAR(posted_at, 'YYYY-MM-DD HH24:MI:SS') as posted_at
        FROM posts
        WHERE title ILIKE $1 OR content ILIKE $2 OR author ILIKE $3
        ORDER BY posted_at DESC
    `;
    const searchQuery = `%${query}%`;

    try {
        const results = await db.query(sqlQuery, [searchQuery, searchQuery, searchQuery]);
        res.json(results.rows);
    } catch (err) {
        console.error("DB 에러:", err);
        res.status(500).json({ error: "Database error" });
    }
});

module.exports = router;
