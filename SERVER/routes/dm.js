const express = require("express");
const router = express.Router();
const { authenticateToken } = require("./auth");
const db = require("../db");

// 🟢 유저 검색 API (ILIKE 적용)
router.get("/search", authenticateToken, async (req, res) => {
    const { query } = req.query;
    console.log("검색 요청 결과값 => :", query);

    if (!query) {
        return res.status(400).send({ message: "검색어를 입력하세요." });
    }

    const sql = "SELECT id, email FROM users WHERE email ILIKE $1"; // PostgreSQL에서는 `ILIKE` 사용
    try {
        const results = await db.query(sql, [`%${query}%`]);
        console.log("검색 결과 => ", results.rows);
        res.json(results.rows);
    } catch (err) {
        console.error("DB 오류 발생:", err);
        res.status(500).send({ message: "DB 오류가 발생했습니다.", error: err });
    }
});

// 🟢 메시지 보내기 및 저장 (RETURNING id 적용)
router.post("/send", authenticateToken, async (req, res) => {
    const { receiverId, content } = req.body;
    const senderEmail = req.user.email; // JWT에서 가져온 사용자 이메일

    if (!receiverId || !content) {
        return res.status(400).send({ message: "수신자와 내용을 확인하세요." });
    }

    const query = `
        INSERT INTO dm_direct_messages (sender_id, receiver_id, content) 
        VALUES ($1, $2, $3) RETURNING id
    `;

    try {
        const result = await db.query(query, [senderEmail, receiverId, content]);
        res.status(201).send({
            message: "메시지가 성공적으로 저장되었습니다.",
            data: {
                id: result.rows[0].id,
                senderEmail,
                receiverId,
                content,
            },
        });
    } catch (err) {
        console.error("메시지 저장 중 오류 발생:", err);
        res.status(500).send({ message: "메시지 저장 중 오류가 발생했습니다.", error: err });
    }
});

// 🟢 대화 기록 조회
router.get("/:receiverEmail", authenticateToken, async (req, res) => {
    const senderEmail = req.user.email;
    const { receiverEmail } = req.params;

    const query = `
        SELECT sender_id, receiver_id, content, 
        TO_CHAR(sent_at, 'YYYY-MM-DD HH24:MI:SS') as sent_at
        FROM dm_direct_messages
        WHERE (sender_id = $1 AND receiver_id = $2)
           OR (sender_id = $2 AND receiver_id = $1)
        ORDER BY sent_at ASC
    `;

    try {
        const results = await db.query(query, [senderEmail, receiverEmail]);
        res.send(results.rows);
    } catch (err) {
        console.error("대화 기록 조회 중 오류 발생:", err);
        res.status(500).send({ message: "대화 기록 조회 중 오류가 발생했습니다.", error: err });
    }
});

// 🟢 읽음 상태 업데이트 (`rowCount` 체크)
router.put("/read/:receiverId", authenticateToken, async (req, res) => {
    const senderId = req.user.id;
    const { receiverId } = req.params;

    const query = `
        UPDATE dm_direct_messages
        SET is_read = TRUE
        WHERE sender_id = $1 AND receiver_id = $2
    `;

    try {
        const result = await db.query(query, [receiverId, senderId]);
        if (result.rowCount === 0) {
            return res.status(404).send({ message: "업데이트할 메시지가 없습니다." });
        }
        res.send({ message: "읽음 상태가 업데이트되었습니다." });
    } catch (err) {
        console.error("읽음 상태 업데이트 중 오류 발생:", err);
        res.status(500).send({ message: "읽음 상태 업데이트 중 오류가 발생했습니다.", error: err });
    }
});

module.exports = router;
