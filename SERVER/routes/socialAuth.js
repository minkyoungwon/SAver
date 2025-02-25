const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const db = require("../db");
const { OAuth2Client } = require("google-auth-library");
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// 🔑 JWT 토큰 생성 함수
function generateToken(userId, email) {
    return jwt.sign({ id: userId, email }, process.env.JWT_SECRET, { expiresIn: "1h" });
}

// 🟢 구글 로그인 API
router.post("/google-login", async (req, res) => {
    try {
        const { tokenId } = req.body;
        const ticket = await googleClient.verifyIdToken({
            idToken: tokenId,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        const { email, picture, sub: googleId } = ticket.getPayload();

        // 🔍 DB에서 기존 소셜 계정 조회
        const sql = `
            SELECT sa.*, u.email AS userEmail, u.id AS userId
            FROM social_accounts AS sa
            JOIN users AS u ON sa.user_id = u.id
            WHERE sa.provider = 'google' AND sa.social_id = $1
        `;
        const result = await db.query(sql, [googleId]);

        let userId;
        if (result.rows.length === 0) {
            // 동일한 이메일의 일반 계정 존재 여부 확인
            const checkUser = await db.query("SELECT * FROM users WHERE email = $1", [email]);

            if (checkUser.rows.length > 0) {
                return res.status(400).json({ message: "이미 존재하는 이메일입니다. 일반 계정으로 로그인하세요." });
            }

            // 📌 새로운 유저 가입
            const userInsertQuery = `
                INSERT INTO users (email, password, profile_image, join_date, is_verified, role)
                VALUES ($1, '', $2, NOW(), true, 'SOCIAL') RETURNING id
            `;
            const userResult = await db.query(userInsertQuery, [email, picture]);
            userId = userResult.rows[0].id;

            // 소셜 계정 정보 추가
            const socialInsertQuery = `
                INSERT INTO social_accounts (user_id, provider, social_id, profile_image)
                VALUES ($1, 'google', $2, $3)
            `;
            await db.query(socialInsertQuery, [userId, googleId, picture]);
        } else {
            userId = result.rows[0].userid;
        }

        // 🎟️ 토큰 생성 후 응답
        const token = generateToken(userId, email);
        return res.status(200).json({ token, user: { id: userId, email, picture }, message: "구글 로그인/가입 완료" });
    } catch (error) {
        console.error("Google 소셜 로그인 처리 오류:", error);
        return res.status(400).json({ error: "구글 로그인 실패" });
    }
});

// 🟢 구글 계정 존재 여부 확인 API
router.post("/google-verify-only", async (req, res) => {
    const { tokenId } = req.body;
    try {
        const ticket = await googleClient.verifyIdToken({
            idToken: tokenId,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        const { email, name, picture, sub: googleId } = ticket.getPayload();

        console.log("Google ID 토큰 검증 성공:", { email, name, googleId });

        const sql = `
            SELECT sa.*, u.email AS userEmail, u.id AS userId
            FROM social_accounts AS sa
            JOIN users AS u ON sa.user_id = u.id
            WHERE sa.provider = 'google' AND sa.social_id = $1
        `;
        const result = await db.query(sql, [googleId]);

        if (result.rows.length > 0) {
            // 🎟️ 기존 유저 → 로그인 처리
            const userId = result.rows[0].userid;
            const token = generateToken(userId, email);
            return res.status(200).json({
                existingUser: true,
                token,
                user: { id: userId, email, picture },
                message: "이미 가입된 소셜 계정 → 로그인 완료",
            });
        }

        // 새로운 사용자 → 회원가입 필요
        return res.status(200).json({
            existingUser: false,
            email,
            name,
            picture,
            googleId,
            message: "등록되지 않은 소셜 계정 → 회원가입 필요",
        });
    } catch (error) {
        console.error("Google ID 토큰 검증 실패:", error);
        return res.status(400).json({ error: "구글 검증 실패" });
    }
});

// 🟢 구글 회원가입 API
router.post("/google-signup-confirm", async (req, res) => {
    const { email, googleId, name, picture } = req.body;

    try {
        // 이메일 중복 확인
        const checkQuery = "SELECT * FROM users WHERE email = $1";
        const checkResult = await db.query(checkQuery, [email]);

        if (checkResult.rows.length > 0) {
            return res.status(400).json({ message: "이미 가입된 이메일입니다." });
        }

        // 📌 신규 유저 추가
        const userInsertQuery = `
            INSERT INTO users (email, password, profile_image, join_date, is_verified, role)
            VALUES ($1, '', $2, NOW(), true, 'SOCIAL') RETURNING id
        `;
        const userResult = await db.query(userInsertQuery, [email, picture]);
        const userId = userResult.rows[0].id;

        // 📌 소셜 계정 정보 추가
        const socialInsertQuery = `
            INSERT INTO social_accounts (user_id, provider, social_id, profile_image)
            VALUES ($1, 'google', $2, $3)
        `;
        await db.query(socialInsertQuery, [userId, googleId, picture]);

        // 🎟️ 토큰 생성 후 응답
        const token = generateToken(userId, email);
        return res.status(201).json({
            token,
            user: { id: userId, email, name, picture },
            message: "구글 소셜 회원가입 완료",
        });
    } catch (error) {
        console.error("회원가입 중 오류:", error);
        return res.status(500).json({ error: "회원가입 실패" });
    }
});

module.exports = (db) => router;
