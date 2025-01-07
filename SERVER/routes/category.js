const express = require('express');
const router = express.Router();

module.exports = (db) => {
    router.get("/", (req, res) => {
        const query = "SELECT * FROM coupon_categories";
        db.query(query, (err, result) => {
            if(err) {
                return res.status(500).send(err);
            }
            res.send(result);
        })
    })
    router.post("/",(req,res) => {
        const {name, user_id} = req.body;
        const query = "INSERT INTO coupon_categories (name, user_id) VALUES (?, ?)";
        db.query(query, [name, user_id], (err, result) => {
            if(err) {
                return res.status(500).send(err);
            }
            res.status(200).send("카테고리 추가 완료");
        })
    })

    return router;
}