// 라우트 처리하기 전의 코드

// be/app.js
const express = require("express");
const cors = require("cors");
const db = require("./db");
const app = express();
const port = process.env.PORT;

// 회원가입시 비밀번호 보안을 위해 설치함함
const bcrypt = require("bcrypt");
// jwt 사용하여서 세선 유지하기 위해 설치
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
// 이메일 인증for
const crypto = require("crypto");

app.use(cors());
app.use(express.json());

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

// 로그인 API
app.post("/api/login", (req, res) => {
  const { email, password } = req.body;
  const query = "SELECT * FROM users WHERE email = ?";

  db.query(query, [email], async (err, results) => {
    if (err || results.length === 0) {
      return res
        .status(401)
        .send({ message: "잘못된 이메일 또는 비밀번호입니다." });
    }

    const user = results[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res
        .status(401)
        .send({ message: "잘못된 이메일 또는 비밀번호입니다." });
    }

    // JWT 토큰 생성 (1시간 유효) // 테스트로 일단 30ms 초 넣음음
    const token = jwt.sign(
      { id: user.id, email: user.email },
      "너의 보안 jwt",
      { expiresIn: "1hr" }
    );
    res.send({ message: "로그인 성공!", token });
  });
});

// 글 작성 API (POST 요청 핸들러)
app.post("/api/posts", (req, res) => {
  const { title, content, author } = req.body; // author 추가
  const query = "INSERT INTO posts (title, content, author) VALUES (?, ?, ?)";
  db.query(query, [title, content, author], (err, result) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.status(201).send({ id: result.insertId, title, content, author });
  });
});

// 글 목록 조회 API (GET 요청 핸들러)
app.get("/api/posts", (req, res) => {
  const query =
    'SELECT id, title, content, author, DATE_FORMAT(created_at, "%Y-%m-%d %H:%i:%s") as created_at FROM posts ORDER BY created_at DESC';

  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.send(results);
  });
});

// 글 상세 조회 API
app.get("/api/posts/:id", (req, res) => {
  const { id } = req.params;
  const query = "SELECT * FROM posts WHERE id = ?";

  db.query(query, [id], (err, results) => {
    if (err) {
      return res.status(500).send(err);
    }
    if (results.length === 0) {
      return res.status(404).send({ message: "게시글을 찾을 수 없습니다." });
    }
    res.send(results[0]);
  });
});

// 글 삭제 API
app.delete("/api/posts/:id", (req, res) => {
  const { id } = req.params;
  const query = "DELETE FROM posts WHERE id = ?";

  db.query(query, [id], (err, result) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.status(200).send({ message: "글이 삭제되었습니다." });
  });
});

//글 수정 api
app.put("/api/posts/:id", (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;
  const query = "UPDATE posts SET title = ?, content = ? WHERE id = ?";

  db.query(query, [title, content, id], (err, result) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.status(200).send({ message: "글이 수정되었습니다." });
  });
});

// 댓글 작성 API
app.post("/api/comments", (req, res) => {
  const { postId, text } = req.body;
  const query = "INSERT INTO comments (post_id, text) VALUES (?, ?)";

  db.query(query, [postId, text], (err, result) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.status(201).send({ id: result.insertId, postId, text });
  });
});

// 댓글 조회 API
app.get("/api/comments/:postId", (req, res) => {
  const { postId } = req.params;
  const query = "SELECT * FROM comments WHERE post_id = ?";

  db.query(query, [postId], (err, results) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.send(results);
  });
});

app.post("/api/signup", async (req, res) => {
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
        "INSERT INTO users (email, password, profile_image, join_data, is_verified) VALUES (?, ?, NULL, NOW(), false)";
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

// 이메일 인증 API
app.get("/api/verify-email", (req, res) => {
  const { token } = req.query;

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

// 이메일 인증 코드 전송 API
app.post("/api/send-verification-code", (req, res) => {
  const { email } = req.body;
  const verificationCode = crypto.randomInt(100000, 999999).toString();

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

// 인증 코드 확인 API
app.post("/api/verify-code", (req, res) => {
  const { email, code } = req.body;

  if (global.verificationCodes && global.verificationCodes[email] === code) {
    delete global.verificationCodes[email];
    res.send({ message: "인증이 완료되었습니다." });
  } else {
    res.status(400).send({ message: "인증 코드가 올바르지 않습니다." });
  }
});

app.get("/api/coupons", (req, res) => {
  const query = "SELECT * FROM coupons WHERE user_id = ?";
  db.query(query, [req.user.id], (err, results) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.send(results);
  });
});
app.get("/api/category", (req, res) => {
  // 쿠폰 카테고리 조회 (category 테이블을 만들 것인지 coupons 테이블에 카테고리 컬럼을 만들 것인지 결정 필요)
  const query = "SELECT DISTINCT name FROM coupon_categories WHERE user_id = ?";
  db.query(query, [req.user.id], (err, results) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.send(results);
  });
});

// 서버 실행
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
