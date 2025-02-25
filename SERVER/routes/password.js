const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const { authenticateToken } = require("../routes/auth");
const db = require('../db');

// 비밀번호 확인 및 변경
router.put("/change", authenticateToken, async (req, res) => {
    const userId = req.user.id; // authenticateToken 미들웨어가 토큰 디코딩 결과를 넣어 줌
    const { currentPassword, newPassword } = req.body;

    try {
        // 1️⃣ 현재 비밀번호 조회
        const query = "SELECT password FROM users WHERE id = $1";
        const result = await db.query(query, [userId]);

        if (result.rows.length === 0) {
            return res.status(404).send({ message: "사용자를 찾을 수 없습니다." });
        }

        const hashedPassword = result.rows[0].password;

        // 2️⃣ 비밀번호 비교
        console.log("입력된 비밀번호:", currentPassword);
        console.log("DB에 저장된 해시 값:", hashedPassword);

        const isMatch = await bcrypt.compare(currentPassword, hashedPassword);
        console.log("비밀번호 비교 결과:", isMatch);

        if (!isMatch) {
            return res.status(400).send({ message: "현재 비밀번호가 일치하지 않습니다." });
        }

        // 3️⃣ 새 비밀번호 해싱 후 업데이트
        const newHashedPassword = await bcrypt.hash(newPassword, 10);
        const updateQuery = "UPDATE users SET password = $1 WHERE id = $2";
        const updateResult = await db.query(updateQuery, [newHashedPassword, userId]);

        if (updateResult.rowCount === 0) {
            return res.status(500).send({ message: "비밀번호 변경 실패" });
        }

        res.send({ message: "비밀번호가 성공적으로 변경되었습니다." });

    } catch (error) {
        console.error("비밀번호 처리 중 오류:", error);
        res.status(500).send({ message: "비밀번호 변경 중 오류가 발생했습니다." });
    }
});

module.exports = router;
