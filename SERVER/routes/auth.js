// routes/auth.js
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

// [기존 주석 유지 + 아래 라우트 수정: 회원가입 ("/register" → "/signup")]
// 🟢 회원가입 API
router.post("/signup", async (req, res) => {
  // [신규 주석] 라우트 주소를 "/signup" 으로 변경
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
      .maybeSingle();

    if (checkError) {
      console.error("❌ 이메일 확인 오류:", checkError);
      return res.status(500).json({ message: "이메일 확인 중 오류가 발생했습니다." });
    }

    if (existingUser) {
      return res.status(400).json({ message: "이미 가입된 이메일입니다." });
    }

    // ✅ 비밀번호 해싱
    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ user 임시 추가 (is_verified = false)
    const { data: newUser, error: insertError } = await supabase
      .from("users")
      .insert([
        {
          email,
          password: hashedPassword,
          is_verified: false,
          role: "NORMAL",
          join_date: new Date(),
        },
      ])
      .select("id, email")
      .maybeSingle();

    if (insertError) {
      console.error("❌ 회원가입 오류:", insertError);
      return res.status(500).json({ message: "회원가입 중 오류가 발생했습니다." });
    }

    if (!newUser) {
      return res.status(500).json({ message: "회원가입이 정상적으로 처리되지 않았습니다." });
    }

    // [신규 주석] 회원가입 후에는 일단 가입 완료. 실제 로그인 등은 이메일 인증 이후 가능.
    // 프론트에서 '/email-verification' 화면으로 유도 가능

    // ✅ JWT 토큰(짧게) 생성 → 아직 미검증 상태지만, 필요하다면 응답
    const token = jwt.sign({ id: newUser.id, email: newUser.email }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    return res.status(201).json({
      message: "회원가입이 완료되었습니다. 이메일 인증을 진행해주세요.",
      token,
      user: { id: newUser.id, email: newUser.email },
    });
  } catch (error) {
    console.error("❌ 회원가입 처리 중 오류 발생:", error);
    return res.status(500).json({ message: "회원가입 실패", error: error.message });
  }
});




router.post("/send-verification-code", async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "이메일이 누락되었습니다." });
  }

  try {
    // 🔹 기존 유저 정보 조회
    const { data: user, error: userError } = await supabase
      .from("users")
      .select("id, is_verified")
      .eq("email", email)
      .maybeSingle();

    if (!user) {
      return res.status(404).json({ message: "가입되지 않은 이메일입니다." });
    }
    if (user.is_verified) {
      return res.status(400).json({ message: "이미 이메일 인증이 완료된 계정입니다." });
    }

    // 🔹 새로운 인증 코드 생성
    const code = String(Math.floor(Math.random() * 1000000)).padStart(6, "0");

    // ✅ **만료 시간을 UTC+9로 강제 변환하여 저장**
    const now = new Date();
    const expiresAtUTC9 = new Date(now.getTime() + 10 * 60 * 1000 + 9 * 60 * 60 * 1000).toISOString(); // UTC+9

    console.log("✅ 생성된 인증 코드:", code);
    console.log("✅ 설정된 만료 시간 (UTC+9 기준):", expiresAtUTC9);

    // 🔹 인증 코드 및 만료 시간 저장
    const { error: updateError } = await supabase
      .from("users")
      .update({
        verification_code: code,
        verification_expires: expiresAtUTC9, // ✅ UTC+9 시간으로 저장
      })
      .eq("id", user.id);

    if (updateError) {
      console.error("❌ 인증 코드 저장 오류:", updateError);
      return res.status(500).json({ message: "인증 코드 저장 중 오류가 발생했습니다." });
    }

    // 🔹 인증 코드 이메일 전송
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "회원가입 인증 코드",
      text: `인증 코드: ${code}\n10분 안에 입력해주세요!`,
    };

    await transporter.sendMail(mailOptions);

    return res.json({ message: "인증 코드가 이메일로 전송되었습니다." });
  } catch (error) {
    console.error("❌ 인증 코드 전송 오류:", error);
    return res.status(500).json({ message: "인증 코드 전송 중 오류가 발생했습니다." });
  }
});





router.post("/verify-code", async (req, res) => {
  const { email, code } = req.body;

  if (!email || !code) {
    return res.status(400).json({ message: "이메일과 인증 코드를 입력하세요." });
  }

  try {
    // 🔹 인증 코드 및 만료 시간 조회
    const { data: user, error: userError } = await supabase
      .from("users")
      .select("id, verification_code, verification_expires, is_verified")
      .eq("email", email)
      .maybeSingle();

    if (!user) {
      return res.status(404).json({ message: "가입 내역이 없습니다." });
    }
    if (user.is_verified) {
      return res.status(400).json({ message: "이미 인증된 계정입니다." });
    }

    // 🔹 인증 코드 만료 시간이 `NULL`이면 오류 반환
    if (!user.verification_expires) {
      return res.status(400).json({
        message: "인증 코드가 존재하지 않습니다. 새로운 인증 코드를 요청하세요.",
      });
    }

    // 🔹 현재 UTC 시간
    const nowUTC = new Date();

    // 🔹 DB에서 가져온 UTC 시간 변환 (UTC+9 고려)
    const expiresTimeUTC = new Date(user.verification_expires);

    console.log("✅ 현재 UTC 시간:", nowUTC);
    console.log("✅ DB 저장된 만료 UTC 시간:", expiresTimeUTC);

    // 🔹 만료 시간 비교 (UTC 기준)
    if (nowUTC > expiresTimeUTC) {
      await supabase
        .from("users")
        .update({
          verification_code: null,
          verification_expires: null,
        })
        .eq("id", user.id);

      return res.status(400).json({
        message: "인증 코드가 만료되었습니다. 새로운 인증 코드를 요청하세요.",
      });
    }

    // 🔹 코드 일치 여부 확인
    if (user.verification_code !== code) {
      return res.status(400).json({ message: "인증 코드가 올바르지 않습니다." });
    }

    // 🔹 인증 성공 처리
    const { error: updateError } = await supabase
      .from("users")
      .update({
        is_verified: true,
        verification_code: null,
        verification_expires: null,
      })
      .eq("id", user.id);

    if (updateError) {
      console.error("❌ 이메일 인증 업데이트 오류:", updateError);
      return res.status(500).json({ message: "인증 업데이트 중 오류가 발생했습니다." });
    }

    return res.json({ message: "이메일 인증이 완료되었습니다." });
  } catch (error) {
    console.error("❌ 인증 코드 검증 오류:", error);
    return res.status(500).json({ message: "이메일 인증 중 오류가 발생했습니다." });
  }
});





// 🟢 로그인 API (기존 로직 그대로 유지)
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    console.log("🔍 로그인 요청 email:", email);
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

    // [신규 주석] is_verified 여부 확인
    if (!users.is_verified) {
      return res.status(400).json({ message: "이메일 인증이 완료되지 않은 계정입니다." });
    }

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
