const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const db = require("../db");
const { OAuth2Client } = require("google-auth-library");
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// JWT 토큰 생성 함수
function generateToken(userId, email) {
  return jwt.sign({ id: userId, email }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
}

router.post("/google-login", async (req, res) => {
  try {
    const { tokenId } = req.body;
    const ticket = await googleClient.verifyIdToken({
      idToken: tokenId,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const { email, picture, sub: googleId } = ticket.getPayload();

    // DB 조회
    const [existingSocialAccount] = await new Promise((resolve, reject) => {
      const sql = `
        SELECT sa.*, u.email AS userEmail, u.id AS userId
        FROM social_accounts AS sa
        JOIN users AS u ON sa.user_id = u.id
        WHERE sa.provider = 'google' AND sa.social_id = ?
      `;
      db.query(sql, [googleId], (err, results) => {
        if (err) return reject(err);
        resolve(results);
      });
    });

    let userId;
    // 소셜 계정이 없으면 => 회원가입 로직
    if (!existingSocialAccount) {
      // 이미 같은 email 사용자 있는지 확인
      const [existingUser] = await new Promise((resolve, reject) => {
        db.query("SELECT * FROM users WHERE email = ?", [email], (err, results) => {
          if (err) return reject(err);
          resolve(results);
        });
      });
      if (existingUser) {
        return res
          .status(400)
          .json({ message: "이미 존재하는 이메일입니다. 일반 계정으로 로그인하세요." });
      }

      // 새로 가입
      userId = await new Promise((resolve, reject) => {
        const sql = `
          INSERT INTO users (email, password, profile_image, join_date, is_verified, role)
          VALUES (?, '', ?, NOW(), true, 'SOCIAL')
        `;
        db.query(sql, [email, picture], (err, result) => {
          if (err) return reject(err);
          resolve(result.insertId);
        });
      });

      // social_accounts 추가
      await new Promise((resolve, reject) => {
        db.query(
          "INSERT INTO social_accounts (user_id, provider, social_id, profile_image) VALUES (?, 'google', ?, ?)",
          [userId, googleId, picture],
          (err) => {
            if (err) return reject(err);
            resolve();
          }
        );
      });
    } else {
      // 이미 소셜 계정이 있으면 => 로그인
      userId = existingSocialAccount.userId;
    }

    // 토큰 생성
    const token = generateToken(userId, email);

    return res.status(200).json({
      token,
      user: { id: userId, email, picture },
      message: "구글 로그인/가입 완료",
    });
  } catch (error) {
    console.error("Google 소셜 로그인 처리 오류:", error);
    return res.status(400).json({ error: "구글 로그인 실패" });
  }
});

// [1] 구글 ID 토큰 검증 + DB 존재 여부 확인
router.post("/google-verify-only", async (req, res) => {
  const { tokenId } = req.body;
  try {
    // 1) 구글 토큰 검증
    const ticket = await googleClient.verifyIdToken({
      idToken: tokenId,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const { email, name, picture, sub: googleId } = ticket.getPayload();

    console.log("Google ID 토큰 검증 성공:", { email, name, googleId });

    // 2) DB에 등록된 소셜 계정인지 확인
    const [existingSocialAccount] = await new Promise((resolve, reject) => {
      const sql = `
        SELECT sa.*, u.email AS userEmail, u.id AS userId
        FROM social_accounts AS sa
        JOIN users AS u ON sa.user_id = u.id
        WHERE sa.provider = 'google' AND sa.social_id = ?
      `;
      db.query(sql, [googleId], (err, results) => {
        if (err) return reject(err);
        resolve(results);
      });
    });

    if (existingSocialAccount) {
      // 이미 가입된 사용자면 => 토큰 발급 → 로그인 처리
      const userId = existingSocialAccount.userId;
      const token = generateToken(userId, email);
      return res.status(200).json({
        existingUser: true,
        token,  
        user: { id: userId, email, picture },
        message: "이미 가입된 소셜 계정 → 로그인 완료",
      });
    } else {
      // 새 소셜 사용자 => 회원가입 진행 필요
      return res.status(200).json({
        existingUser: false,
        email,
        name,
        picture,
        googleId,
        message: "등록되지 않은 소셜 계정 → 회원가입 필요",
      });
    }
  } catch (error) {
    console.error("Google ID 토큰 검증 실패:", error);
    return res.status(400).json({ error: "구글 검증 실패" });
  }
});

// [2] 구글 회원가입 라우트
router.post("/google-signup-confirm", async (req, res) => {
  const { email, googleId, name, picture } = req.body;

  try {
    // 혹시 이미 가입된 email이 있다면
    const [existingUser] = await new Promise((resolve, reject) => {
      db.query("SELECT * FROM users WHERE email = ?", [email], (err, results) => {
        if (err) return reject(err);
        resolve(results);
      });
    });
    if (existingUser) {
      return res.status(400).json({ message: "이미 가입된 이메일입니다." });
    }

    // users 테이블에 새 유저 추가
    const userId = await new Promise((resolve, reject) => {
      const sql = `
        INSERT INTO users (email, password, profile_image, join_date, is_verified, role)
        VALUES (?, '', ?, NOW(), true, 'SOCIAL')
      `;
      db.query(sql, [email, picture], (err, result) => {
        if (err) return reject(err);
        resolve(result.insertId);
      });
    });

    // 소셜 계정 정보 추가
    await new Promise((resolve, reject) => {
      const sql = `
        INSERT INTO social_accounts (user_id, provider, social_id, profile_image)
        VALUES (?, 'google', ?, ?)
      `;
      db.query(sql, [userId, googleId, picture], (err) => {
        if (err) return reject(err);
        resolve();
      });
    });

    // 회원가입 후 로그인 토큰 생성 (원한다면 여기서 발급)
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
