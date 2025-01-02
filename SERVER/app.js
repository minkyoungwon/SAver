require('dotenv').config(); //.env 파일에서 호출하는 부분 추가 01.01 민경원 추가
const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const passport = require('passport');
const passportLocal = require('passport-local').Strategy;
const port = process.env.PORT;
const db = require("./db");
const flash = require('connect-flash');


const couponRoutes = require('./routes/coupon');
const authRoutes = require('./routes/auth').createRouter; // 0101 민경원 수정정
const postRoutes = require('./routes/posts');

// 미들웨어 설정

// // CORS 설정 
// 01.01 혹시 몰라서 민경원 추가
app.use(cors({
  origin: "http://localhost:5173",
  methods: ["GET","POST","PUT","DELETE"],
  credentials: true
}))

app.use(cookieParser());
app.use(session({
  secret: 'session-secret',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 30 * 1000 } // 세션 만료 시간 설정 (30분) // 0102 mkw put 
  // //30분으로 하고 싶으면 30 * 60 * 1000으로 하면됨
}));

app.use(express.json());
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());


// 라우트 설정
// 인증 관련 라우트
app.use('/api/auth', authRoutes(db));
// 게시글 관련 라우트
app.use('/api/posts', postRoutes(db));
// 쿠폰 관련 라우트
app.use("/api/coupon", couponRoutes(db));

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});