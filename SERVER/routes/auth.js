const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const db = require('../db');

const crypto = require('crypto'); // 0102 add mkw 


// module.exports = (db) => {
// Nodemailer 설정
const transporter = nodemailer.createTransport({
  host: "smtp.naver.com", // 네이버 SMTP 서버
  port: 465, // SSL 포트
  secure: true, // SSL 사용 여부
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});


// JWT 인증 미들웨어 // 01월 01일 민경원 추가
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  console.log("인증 요청 헤더:", authHeader);
   
  if (!authHeader) {
    console.log("토큰이 없습니다.");
    return res.status(401).json({ message: "로그인이 필요합니다 (인증 토큰이 필요합니다)" });
  }

  const token = authHeader.split(' ')[1];
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: "토큰 검증 실패" });
    }
    // user = { id: ..., email: ... }
    console.log("토큰 검증 성공:", user);
    req.user = user;
    next();
  });
};

// const authenticateToken = (req, res, next) => {
//   const token = req.headers['authorization']?.split(' ')[1];
//   if (!token) return res.status(401).send({ message: "로그인이 필요합니다." });

//   jwt.verify(token, process.env.JWT_SECRET || "보안 jwt", (err, user) => {
//     if (err) return res.status(403).send({ message: "유효하지 않은 토큰입니다." });
//     req.user = user; // 토큰에서 디코딩한 사용자 정보를 요청 객체에 추가
//     next();
//   });
// };



// module.exports = { authenticateToken };


// 로그인 라우트
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1) DB에서 이메일로 사용자 조회
    const query = "SELECT * FROM users WHERE email = ?";
    db.query(query, [email], async (err, results) => {
      if (err) {
        console.error("DB 조회 중 오류:", err);
        return res.status(500).json({ message: "서버 오류가 발생했습니다." });
      }

      // 사용자가 없으면
      if (!results.length) {
        return res.status(400).json({ message: "이메일 또는 비밀번호를 확인하세요." });
      }

      const user = results[0];
      const hashedPassword = user.password;

      // 2) 비밀번호 비교
      const isMatch = await bcrypt.compare(password, hashedPassword);
      if (!isMatch) {
        return res.status(400).json({ message: "이메일 또는 비밀번호를 확인하세요." });
      }

      // 3) JWT 토큰 생성 (id, email을 담음)
      const token = jwt.sign(
        { id: user.id, email: user.email },  // 여기서 id와 email을 토큰에 함께 넣음
        process.env.JWT_SECRET,             // 반드시 .env에 JWT_SECRET 설정
        { expiresIn: '1h' }                 // 토큰 만료 시간(예: 1시간)
      );

      // 4) 응답에 토큰과 사용자 정보 반환
      res.json({
        token,
        user: {
          id: user.id,
          email: user.email,
        },
      });
    });
  } catch (error) {
    console.error("로그인 처리 중 오류:", error);
    return res.status(500).json({ message: "로그인에 실패했습니다." });
  }
});


// 회원가입 라우트
router.post("/signup", async (req, res) => {
  const { email, password } = req.body;
  console.log("회원가입 요청:", email);

  // 이메일 중복 검사
  const checkQuery = "SELECT * FROM users WHERE email = ?";
  db.query(checkQuery, [email], async (err, results) => {
    if (err) {
      console.error("이메일 중복 검사 오류:", err);
      return res.status(500).send({ message: "서버 오류 발생", error: err });
    }
    if (results.length > 0) {
      console.log("이미 존재하는 이메일:", email);
      return res.status(400).send({ message: "이미 존재하는 이메일입니다." });
    }

    try {
      // 비밀번호 해싱
      const hashedPassword = await bcrypt.hash(password, 10);
      console.log("비밀번호 해싱 성공:", hashedPassword);

      // 사용자 등록
      const insertQuery =
        "INSERT INTO users (email, password, profile_image, join_date, is_verified) VALUES (?, ?, NULL, NOW(), false)";
      db.query(insertQuery, [email, hashedPassword], (err) => {
        if (err) {
          console.error("회원가입 중 DB 오류:", err);
          return res
            .status(500)
            .send({ message: "회원가입 중 오류 발생", error: err });
        }
        res.status(201).send({
          message: "회원가입이 완료되었습니다. 이메일을 확인해 주세요.",
        });
      });
    } catch (error) {
      console.error("비밀번호 해싱 오류:", error);
      res.status(500).send({ message: "비밀번호 해싱 중 오류 발생", error });
    }
  });
});

// 이메일 인증
router.get("/verify-email", (req, res) => {
  //const { token } = req.query;
  // 이메일 인증 토큰 생성 시 만료 시간 추가
  const token = jwt.sign({ email }, "your-secret-key", { expiresIn: '1h' });

  try {
    const decoded = jwt.verify(token, "your-secret-key");
    const email = decoded.email;

    // 이메일 인증 상태 업데이트
    const updateQuery = "UPDATE users SET is_verified = true WHERE email = ?";
    db.query(updateQuery, [email], (err) => {
      if (err) {
        return res.status(500).send({ message: "이메일 인증 중 오류 발생" });
      }
      res.send({
        message: "이메일 인증이 완료되었습니다. 이제 로그인할 수 있습니다.",
      });
    });
  } catch (error) {
    res.status(400).send({ message: "유효하지 않은 토큰입니다." });
  }
});

// 인증 코드 전송
router.post("/send-verification-code", (req, res) => {
  console.log("인증코드 요청 도착", req.body.email)
  const { email } = req.body;
  const verificationCode = crypto.randomInt(100000, 999999).toString();
  console.log(`생성된 인증 코드: ${verificationCode}`); // 로그 추가

  // 세션 또는 임시 저장소에 인증 코드 저장 (여기서는 간단하게 메모리 객체에 저장)
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
      return res
        .status(500)
        .send({ message: "이메일 전송 중 오류 발생", error });
    }
    res.send({ message: "인증 코드가 전송되었습니다." });
  });
});

// 인증 코드 확인
router.post("/verify-code", (req, res) => {
  console.log("인증 코드 확인 요청", req.body);
  const { email, code } = req.body;

  if (global.verificationCodes && global.verificationCodes[email] === code) {
    delete global.verificationCodes[email];
    res.send({ message: "인증이 완료되었습니다." });
  } else {
    res.status(400).send({ message: "인증 코드가 올바르지 않습니다." });
  }
});

//     return router;
// }


// 0101 민경원 수정정
module.exports = {
  authenticateToken, // 인증 미들웨어 내보내기
  createRouter: (db) => {
    return router; // 라우터 내보내기
  },
};
