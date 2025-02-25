import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import session from "express-session";
import path from "path";
import supabase from "./db.js"; // ✅ Supabase 클라이언트 적용

// ✅ 라우터 가져오기
import passwordRoutes from "./routes/password.js";
import couponRoutes from "./routes/coupons.js";
import authRoutes from "./routes/auth.js";
import postRoutes from "./routes/posts.js";
import searchRoutes from "./routes/search.js";
import categoryRoutes from "./routes/category.js";
import dmRoutes from "./routes/dm.js";
import socialAuth from "./routes/socialAuth.js";

const app = express();

import { WebSocketServer, WebSocket } from "ws";

// WebSocketServer 생성
const wss = new WebSocketServer({ port: 8080 });
wss.on("connection", (socket) => {
  console.log("WebSocket 연결됨");

  socket.on("message", async (message) => {
    const parsedMessage = JSON.parse(message);
    const { senderId, receiverId, content } = parsedMessage;

    // 현재 연결된 클라이언트 중에서 중복 메시지가 있는지 체크
    let isDuplicate = false;
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        // 중복 메시지 검사
        if (
          client.senderId === senderId &&
          client.receiverId === receiverId &&
          client.content === content
        ) {
          isDuplicate = true;
        }
      }
    });

    if (isDuplicate) {
      console.log("중복 메시지, 전송하지 않음");
      return; // 중복된 메시지는 보내지 않음
    }

    // 연결된 모든 클라이언트에게 메시지 전송
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(
          JSON.stringify({
            senderId,
            receiverId,
            content,
            sent_at: new Date(),
          })
        );
      }
    });
  });

  socket.on("close", () => {
    console.log("WebSocket 연결 종료");
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
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

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
