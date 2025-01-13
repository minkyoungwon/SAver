
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const db = require("../db");
const { OAuth2Client } = require("google-auth-library");

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// [공통 함수] userId로 토큰 발행
function generateToken(userId, email) {
  // id, email 등 필요한 정보
  return jwt.sign({ id: userId, email }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
}

// [Google 소셜 로그인 라우트]
router.post("/google-login", async (req, res) => {
  const { tokenId } = req.body;

  try {
    // 1) Google ID 토큰 검증
    const ticket = await googleClient.verifyIdToken({
      idToken: tokenId,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const { email, name, picture, sub: googleId } = ticket.getPayload();

    // 2) 'social_accounts'에서 (provider='google', social_id=googleId) 검색
    const existingSocialAccount = await new Promise((resolve, reject) => {
      const sql = `
        SELECT sa.*, u.email AS userEmail, u.id AS userId
        FROM social_accounts AS sa
        JOIN users AS u ON sa.user_id = u.id
        WHERE sa.provider = 'google' AND sa.social_id = ?
        LIMIT 1
      `;
      db.query(sql, [googleId], (err, results) => {
        if (err) return reject(err);
        resolve(results[0]);
      });
    });

    let userId;
    let isNewUser = false;

    if (existingSocialAccount) {
      // 이미 등록된 소셜 계정
      userId = existingSocialAccount.userId;
    } else {
      // 기존 소셜 계정이 없으므로 새로 생성
      // 3) 'users' 테이블에 email이 이미 있는지 중복 체크 (원하는 경우)
      const existingUser = await new Promise((resolve, reject) => {
        db.query(
          "SELECT * FROM users WHERE email = ?",
          [email],
          (err, results) => {
            if (err) return reject(err);
            resolve(results[0]);
          }
        );
      });

      if (!existingUser) {
        // 4) users 테이블에 새 유저 생성 (비밀번호는 NULL 처리)
        userId = await new Promise((resolve, reject) => {
          const sql = `
            INSERT INTO users (email, password, profile_image, join_date, is_verified)
           VALUES (?, '', ?, NOW(), true)
          `;
          db.query(sql, [email, picture], (err, result) => {
            if (err) return reject(err);
            resolve(result.insertId);
          });
        });
        isNewUser = true;
      } else {
        // 이메일만 이미 있는 경우(특수 케이스) → 기존 user id 사용
        userId = existingUser.id;
      }

      // 5) social_accounts 테이블에 소셜 계정 정보 등록
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
    }

    // 6) JWT 토큰 생성 후 응답
    const token = generateToken(userId, email);
    return res.status(200).json({
      token,
      user: { id: userId, email, picture },
      message: isNewUser
        ? "구글 소셜 회원가입이 완료되었습니다."
        : "구글 소셜 로그인 성공!",
    });
  } catch (error) {
    console.error("Google 소셜 로그인 처리 오류:", error);
    return res.status(400).json({ error: "로그인 실패" });
  }
});

//module.exports = router;
module.exports = (db) => router;

