const express = require('express');
const morgan = require('morgan');
const path = require('path');
const couponRouter = require('./routes/coupon');
const indexRouter = require('./routes/index');

const app = express();

// 미들웨어 설정
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 라우트 등록
app.use('/coupon-images', couponRouter);
app.use('/', indexRouter);

app.use('/', express.static(path.join(__dirname, '../public')));

app.use((req, res, next) => {
    res.status(404).send('Not Found');
});

app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).send(err.message);
});

module.exports = app;
