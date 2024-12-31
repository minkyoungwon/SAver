const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const passport = require('passport');
const passportLocal = require('passport-local').Strategy;
const flash = require('connect-flash');
const port = process.env.PORT;
const authRoutes = require('./routes/auth');
const postRoutes = require('./routes/posts');
const db = require("./db");

// 미들웨어 설정
app.use(cors());
app.use(cookieParser());
app.use(session({
  secret: 'session-secret',
  resave: false,
  saveUninitialized: false
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

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});