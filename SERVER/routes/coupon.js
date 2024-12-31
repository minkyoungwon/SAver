const express = require('express');
const router = express.Router();

module.exports = (db) => {
    // 쿠폰 목록 조회
    router.get("/", (req, res) => {
        const {userId} = req.body;
        const query = "SELECT * FROM coupons WHERE userId = ?";
        db.query(query, [userId], (err, result) => {
            if(err) {
                return res.status(500).send(err);
            }
            res.send(result);
        })
    })

    return router;
}