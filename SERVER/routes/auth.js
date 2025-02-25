const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const db = require('../db');
const crypto = require('crypto');
const { OAuth2Client } = require('google-auth-library');

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// 📧 Nodemailer 설정
const transporter = nodemailer.createTransport({
    host: "smtp.naver.com",
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

// 🔑 JWT 인증 미들웨어
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    console.log("인증 요청 헤더:", authHeader);

    if (!authHeader) {
        return res.status(401).json({ message: "로그인이 필요합니다 (인증 토큰이 필요합니다)" });
    }

    const token = authHeader.split(' ')[1];
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ message: "토큰 검증 실패" });
        }
        req.user = user;
        next();
    });
};

// 🟢 로그인 API
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const query = "SELECT * FROM users WHERE email = $1";
        const result = await db.query(query, [email]);

        if (result.rows.length === 0) {
            return res.status(400).json({ message: "이메일 또는 비밀번호를 확인하세요." });
        }

        const user = result.rows[0];
        const hashedPassword = user.password;

        const isMatch = await bcrypt.compare(password, hashedPassword);
        if (!isMatch) {
            return res.status(400).json({ message: "이메일 또는 비밀번호를 확인하세요." });
        }

        const token = jwt.sign(
            { id: user.id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.json({
            token,
            user: { id: user.id, email: user.email },
        });
    } catch (error) {
        console.error("로그인 처리 중 오류:", error);
        res.status(500).json({ message: "로그인에 실패했습니다." });
    }
});

// 🟢 회원가입 API
router.post("/signup", async (req, res) => {
    const { email, password } = req.body;
    console.log("회원가입 요청:", email);

    try {
        // 이메일 중복 검사
        const checkQuery = "SELECT * FROM users WHERE email = $1";
        const checkResult = await db.query(checkQuery, [email]);

        if (checkResult.rows.length > 0) {
            return res.status(400).json({ message: "이미 존재하는 이메일입니다." });
        }

        // 비밀번호 해싱
        const hashedPassword = await bcrypt.hash(password, 10);

        // 사용자 등록
        const insertQuery = `
            INSERT INTO users (email, password, profile_image, join_date, is_verified)
            VALUES ($1, $2, NULL, NOW(), false) RETURNING id
        `;
        const result = await db.query(insertQuery, [email, hashedPassword]);

        res.status(201).json({
            message: "회원가입이 완료되었습니다. 이메일을 확인해 주세요.",
            userId: result.rows[0].id
        });

    } catch (error) {
        console.error("회원가입 중 오류:", error);
        res.status(500).json({ message: "회원가입 중 오류가 발생했습니다." });
    }
});

// 🟢 이메일 인증 API
router.get("/verify-email", async (req, res) => {
    const { token } = req.query;

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const email = decoded.email;

        const updateQuery = "UPDATE users SET is_verified = true WHERE email = $1";
        const result = await db.query(updateQuery, [email]);

        if (result.rowCount === 0) {
            return res.status(400).json({ message: "유효하지 않은 이메일입니다." });
        }

        res.json({ message: "이메일 인증이 완료되었습니다. 이제 로그인할 수 있습니다." });

    } catch (error) {
        res.status(400).json({ message: "유효하지 않은 토큰입니다." });
    }
});

// 🟢 인증 코드 전송 API
router.post("/send-verification-code", async (req, res) => {
    const { email } = req.body;
    console.log("인증코드 요청 도착", email);

    try {
        const verificationCode = crypto.randomInt(100000, 999999).toString();
        console.log(`생성된 인증 코드: ${verificationCode}`);

        // 인증 코드 저장
        if (!global.verificationCodes) {
            global.verificationCodes = {};
        }
        global.verificationCodes[email] = verificationCode;

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: "이메일 인증 코드",
            text: `인증 코드: ${verificationCode}`,
        };

        transporter.sendMail(mailOptions, (error) => {
            if (error) {
                return res.status(500).json({ message: "이메일 전송 중 오류 발생", error });
            }
            res.json({ message: "인증 코드가 전송되었습니다." });
        });
    } catch (error) {
        console.error("이메일 전송 오류:", error);
        res.status(500).json({ message: "인증 코드 전송 중 오류가 발생했습니다." });
    }
});

// 🟢 인증 코드 확인 API
router.post("/verify-code", (req, res) => {
    const { email, code } = req.body;
    console.log("인증 코드 확인 요청", req.body);

    if (global.verificationCodes && global.verificationCodes[email] === code) {
        delete global.verificationCodes[email];
        res.json({ message: "이메일 인증이 완료되었습니다." });
    } else {
        res.status(400).json({ message: "인증 코드가 올바르지 않습니다." });
    }
});

module.exports = router; 
