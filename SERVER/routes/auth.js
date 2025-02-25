import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import { OAuth2Client } from "google-auth-library";
import supabase from "../db.js"; // ✅ Supabase 클라이언트 가져오기

const router = express.Router();
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

// 🟢 회원가입 API
router.post("/register", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "이메일과 비밀번호를 입력하세요." });
  }

  try {
    // ✅ 이메일 중복 확인
    const { data: existingUser, error: checkError } = await supabase
      .from("users")
      .select("id")
      .eq("email", email)
      .maybeSingle(); // 🔍 기존의 single()에서 maybeSingle()로 변경하여 에러 방지

    if (checkError) {
      console.error("❌ 이메일 확인 오류:", checkError);
      return res.status(500).json({ message: "이메일 확인 중 오류가 발생했습니다." });
    }

    if (existingUser) {
      return res.status(400).json({ message: "이미 가입된 이메일입니다." });
    }

    // ✅ 비밀번호 해싱
    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ 기본값 설정하여 사용자 추가
    const { data: newUser, error: insertError } = await supabase
      .from("users")
      .insert([
        {
          email,
          password: hashedPassword,
          is_verified: false, // 🔍 기본값 설정
          role: "NORMAL", // 🔍 기본값 설정
          join_date: new Date(),
        },
      ])
      .select("id, email")
      .maybeSingle(); // 🔍 single() 대신 maybeSingle() 사용

    if (insertError) {
      console.error("❌ 회원가입 오류:", insertError);
      return res.status(500).json({ message: "회원가입 중 오류가 발생했습니다." });
    }

    if (!newUser) {
      return res.status(500).json({ message: "회원가입이 정상적으로 처리되지 않았습니다." });
    }

    // ✅ JWT 토큰 생성
    const token = jwt.sign({ id: newUser.id, email: newUser.email }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    return res.status(201).json({
      message: "회원가입이 완료되었습니다.",
      token,
      user: { id: newUser.id, email: newUser.email },
    });
  } catch (error) {
    console.error("❌ 회원가입 처리 중 오류 발생:", error);
    return res.status(500).json({ message: "회원가입 실패", error: error.message });
  }
});

// 🔑 JWT 인증 미들웨어
export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: "로그인이 필요합니다 (인증 토큰이 필요합니다)" });
  }

  const token = authHeader.split(" ")[1];
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: "토큰 검증 실패" });
    }
    req.user = user;
    next();
  });
};

// 🟢 로그인 API
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    console.log("🔍 로그인 요청 email:", email);

    // ✅ Supabase의 from() 메서드 사용
    const { data: users, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .single();

    if (error) {
      console.error("❌ Supabase 쿼리 오류:", error);
      return res.status(500).json({ message: "데이터베이스 오류 발생" });
    }

    if (!users) {
      return res.status(400).json({ message: "이메일 또는 비밀번호를 확인하세요." });
    }

    console.log("🔍 조회된 사용자:", users);

    const isMatch = await bcrypt.compare(password, users.password);
    if (!isMatch) {
      return res.status(400).json({ message: "이메일 또는 비밀번호를 확인하세요." });
    }

    // ✅ JWT 생성
    const token = jwt.sign({ id: users.id, email: users.email }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    console.log("✅ 로그인 성공, 토큰 발급 완료");

    res.json({
      token,
      user: { id: users.id, email: users.email },
    });
  } catch (error) {
    console.error("❌ 로그인 처리 중 오류 발생:", error);
    res.status(500).json({ message: "로그인에 실패했습니다.", error: error.message });
  }
});

export default router;
