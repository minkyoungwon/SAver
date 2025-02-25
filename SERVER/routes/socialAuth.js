import express from "express";
import jwt from "jsonwebtoken";
import supabase from "../db.js"; // ✅ Supabase 적용
import { OAuth2Client } from "google-auth-library";

const router = express.Router();
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

    // 🔍 기존 소셜 계정 조회
    const { data: socialUser, error: socialError } = await supabase
      .from("social_accounts")
      .select("user_id")
      .eq("provider", "google")
      .eq("social_id", googleId)
      .single();

    if (socialError && socialError.code !== "PGRST116") {
      console.error("❌ 소셜 계정 조회 오류:", socialError);
      return res.status(500).json({ message: "소셜 로그인 중 오류가 발생했습니다." });
    }

    let userId;
    if (!socialUser) {
      // 동일한 이메일의 일반 계정 존재 여부 확인
      const { data: existingUser, error: checkError } = await supabase
        .from("users")
        .select("id")
        .eq("email", email)
        .single();

      if (checkError && checkError.code !== "PGRST116") {
        console.error("❌ 이메일 중복 확인 오류:", checkError);
        return res.status(500).json({ message: "이메일 확인 중 오류가 발생했습니다." });
      }

      if (existingUser) {
        return res.status(400).json({ message: "이미 존재하는 이메일입니다. 일반 계정으로 로그인하세요." });
      }

      // 📌 새로운 유저 가입
      const { data: newUser, error: insertError } = await supabase
        .from("users")
        .insert([{ email, password: "", profile_image: picture, join_date: new Date(), is_verified: true, role: "SOCIAL" }])
        .select("id")
        .single();

      if (insertError) {
        console.error("❌ 사용자 추가 오류:", insertError);
        return res.status(500).json({ message: "사용자 등록 중 오류가 발생했습니다." });
      }

      userId = newUser.id;

      // 소셜 계정 정보 추가
      const { error: socialInsertError } = await supabase
        .from("social_accounts")
        .insert([{ user_id: userId, provider: "google", social_id: googleId, profile_image: picture }]);

      if (socialInsertError) {
        console.error("❌ 소셜 계정 추가 오류:", socialInsertError);
        return res.status(500).json({ message: "소셜 계정 등록 중 오류가 발생했습니다." });
      }
    } else {
      userId = socialUser.user_id;
    }

    // 🎟️ 토큰 생성 후 응답
    const token = generateToken(userId, email);
    return res.status(200).json({ token, user: { id: userId, email, picture }, message: "구글 로그인/가입 완료" });
  } catch (error) {
    console.error("Google 소셜 로그인 처리 오류:", error);
    return res.status(400).json({ error: "구글 로그인 실패" });
  }
});

// 🟢 구글 회원가입 API
router.post("/google-signup-confirm", async (req, res) => {
  const { email, googleId, name, picture } = req.body;

  try {
    // 이메일 중복 확인
    const { data: existingUser, error: checkError } = await supabase
      .from("users")
      .select("id")
      .eq("email", email)
      .single();

    if (checkError && checkError.code !== "PGRST116") {
      console.error("❌ 이메일 중복 확인 오류:", checkError);
      return res.status(500).json({ message: "이메일 확인 중 오류가 발생했습니다." });
    }

    if (existingUser) {
      return res.status(400).json({ message: "이미 가입된 이메일입니다." });
    }

    // 📌 신규 유저 추가
    const { data: newUser, error: insertError } = await supabase
      .from("users")
      .insert([{ email, password: "", profile_image: picture, join_date: new Date(), is_verified: true, role: "SOCIAL" }])
      .select("id")
      .single();

    if (insertError) {
      console.error("❌ 사용자 추가 오류:", insertError);
      return res.status(500).json({ message: "사용자 등록 중 오류가 발생했습니다." });
    }

    const userId = newUser.id;

    // 📌 소셜 계정 정보 추가
    const { error: socialInsertError } = await supabase
      .from("social_accounts")
      .insert([{ user_id: userId, provider: "google", social_id: googleId, profile_image: picture }]);

    if (socialInsertError) {
      console.error("❌ 소셜 계정 추가 오류:", socialInsertError);
      return res.status(500).json({ message: "소셜 계정 등록 중 오류가 발생했습니다." });
    }

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

export default router;
