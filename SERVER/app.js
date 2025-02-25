require("dotenv").config(); // 🔥 .env 파일 로드
const express = require("express");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const path = require("path");
const pool = require("./db");

// ✅ 라우터 가져오기
const passwordRoutes = require("./routes/password");
const couponRoutes = require("./routes/coupons");
const authRoutes = require("./routes/auth");
const postRoutes = require("./routes/posts");
const searchRoutes = require("./routes/search");
const categoryRoutes = require("./routes/category");
const dmRoutes = require("./routes/dm");
const socialAuth = require("./routes/socialAuth");

// ✅ 웹소켓 설정 (DM 기능)
const WebSocket = require("ws");
const wss = new WebSocket.Server({ port: 8080 });

wss.on("connection", (ws) => {
  ws.on("message", (data) => {
    const message = JSON.parse(data);
    console.log("메시지 수신:", message);

    if (!message.senderId || !message.receiverId || !message.content) {
      console.error("잘못된 메시지 데이터");
      return;
    }

    const query = `
      INSERT INTO dm_direct_messages (sender_id, receiver_id, content)
      VALUES ($1, $2, $3)
    `;
    pool.query(query, [message.senderId, message.receiverId, message.content], (err) => {
      if (err) {
        console.error("DB 저장 중 오류 발생:", err);
        return;
      }
      console.log("메시지 DB 저장 완료");
    });

    wss.clients.forEach((client) => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(message));
      }
    });
  });

  ws.on("close", () => {
    console.log("클라이언트 연결 종료");
  });
});

// ✅ 미들웨어 설정
app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(
  session({
    secret: "session-secret",
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 60 * 60 * 1000 },
  })
);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ✅ 라우트 설정
app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/coupons", couponRoutes);
app.use("/api/password", passwordRoutes);
app.use("/api/search", searchRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/dm", dmRoutes);
app.use("/api/socialAuth", socialAuth);

// ✅ 서버 실행
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`✅ Server is running on port ${port}`);
});




// require("dotenv").config(); //.env 파일에서 호출하는 부분 추가 01.01 민경원 추가
// const express = require("express");
// const app = express();
// const bcrypt = require("bcrypt");
// const jwt = require("jsonwebtoken");
// const cors = require("cors");
// const cookieParser = require("cookie-parser");
// const session = require("express-session");
// const passport = require("passport");
// const passportLocal = require("passport-local").Strategy;
// const port = process.env.PORT;
// //const db = require("./db");
// const pool = require("./db");
// const flash = require("connect-flash");
// const path = require("path");

// const passwordRoutes = require("./routes/password");

// const couponRoutes = require("./routes/coupons");
// const authRoutes = require("./routes/auth").createRouter; // 0101 민경원 수정정
// const postRoutes = require("./routes/posts");
// const searchRoutes = require("./routes/search"); //add 0105 mkw
// const categoryRoutes = require("./routes/category");
// const dmRoutes = require("./routes/dm");


// //소셜로그인
// const socialAuth = require("./routes/socialAuth")

// // 웹 소켓
// const WebSocket = require("ws");
// const wss = new WebSocket.Server({ port: 8080 }); 
// wss.on("connection", (ws) => {
//   ws.on("message", (data) => {
//     const message = JSON.parse(data);
//     console.log("메시지 수신:", message);

//     // 메시지 데이터 검증
//     if (!message.senderId || !message.receiverId || !message.content) {
//       console.error("잘못된 메시지 데이터");
//       return;
//     }

//     // 1) 메시지를 DB에 저장
//     const query = `
//       INSERT INTO dm_direct_messages (sender_id, receiver_id, content)
//       VALUES (?, ?, ?)
//     `;
//     db.query(query, [message.senderId, message.receiverId, message.content], (err) => {
//       if (err) {
//         console.error("DB 저장 중 오류 발생:", err);
//         return;
//       }
//       console.log("메시지 DB 저장 완료");
//     });

//     // 2) 다른 클라이언트에게 메시지 브로드캐스트
//     wss.clients.forEach((client) => {
//       if (client !== ws && client.readyState === WebSocket.OPEN) {
//         client.send(JSON.stringify(message));
//       }
//     });
//   });

//   ws.on("close", () => {
//     console.log("클라이언트 연결 종료");
//   });
// });



// // 미들웨어 설정

// // // CORS 설정
// app.use(
//   // cors({
//   //   origin: "http://localhost:5173",
//   //   methods: ["GET", "POST", "PUT", "DELETE"],
//   //   credentials: true,
//   // })
//   cors()
// );

// app.use(cookieParser());
// app.use(
//   session({
//     secret: "session-secret",
//     resave: false,
//     saveUninitialized: false,
//     cookie: { maxAge: 60 * 60 * 1000 }, // 세션 만료 시간 설정 (30분) // 0102 mkw put
//     // 30초(30 * 1000)
//     // 30분(30분 * 60초 * 1000밀리초)
//     // 60분(60분 * 60초 * 1000밀리초)
//   })
// );

// app.use(express.json());
// app.use(passport.initialize());
// app.use(passport.session());
// app.use(flash());
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// // 라우트 설정
// // 인증 관련 라우트
// app.use("/api/auth", authRoutes(pool));
// // 게시글 관련 라우트
// app.use("/api/posts", postRoutes(pool));
// // 쿠폰 관련 라우트
// app.use("/api/coupons", couponRoutes(pool));
// // 비밀번호 변경 관련 라우트
// app.use("/api/password", passwordRoutes); // 추가 0103 mkw
// // 검색 관련 라우트
// app.use("/api/search", searchRoutes); // add 0105 mkw
// // 카테고리 관련 라우트
// app.use("/api/category", categoryRoutes(pool));
// // DM 관련 라우트
// app.use("/api/dm", dmRoutes);
// // 소셜 로그인 라우트
// app.use("/api/socialAuth", socialAuth(pool));



// app.listen(port, () => {
//   console.log(`Server is running on port ${port}`);
// });
