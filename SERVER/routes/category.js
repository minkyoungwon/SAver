const express = require("express");
const router = express.Router();

module.exports = (db) => {
  // 카테고리 조회 API
  router.get("/", (req, res) => {
    const query = "SELECT * FROM coupon_categories";
    db.query(query, (err, result) => {
      if (err) {
        return res.status(500).send(err);
      }
      res.send(result);
    });
  });
  // 카테고리 추가 API
  router.post("/", (req, res) => {
    const { name, user_id } = req.body;
    const query = "INSERT INTO coupon_categories (name, user_id) VALUES (?, ?)";
    db.query(query, [name, user_id], (err, result) => {
      if (err) {
        return res.status(500).send(err);
      }
      res.status(200).send("카테고리 추가 완료");
    });
  });

  // 카테고리 수정 API
  router.put("/:id", (req, res) => {
    const { name } = req.body;
    const categoryId = req.params.id;
    const query = "UPDATE coupon_categories SET name = ? WHERE id = ?";
    
    db.query(query, [name, categoryId], (err, result) => {
      if (err) {
        return res.status(500).send(err);
      }
      if (result.affectedRows === 0) {
        return res.status(404).send("카테고리를 찾을 수 없습니다.");
      }
      res.status(200).send("카테고리 수정 완료");
    });
  });

  // 카테고리 삭제 API
  router.delete("/:id", (req, res) => {
    const categoryId = req.params.id;
    const query = "DELETE FROM coupon_categories WHERE id = ?";
    
    db.query(query, [categoryId], (err, result) => {
      if (err) {
        return res.status(500).send(err);
      }
      if (result.affectedRows === 0) {
        return res.status(404).send("카테고리를 찾을 수 없습니다.");
      }
      res.status(200).send("카테고리 삭제 완료");
    });
  });

  return router;
};
