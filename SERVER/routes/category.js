const express = require("express");
const router = express.Router();

module.exports = (db) => {
  // 🟢 카테고리 조회 API
  router.get("/", async (req, res) => {
    console.log("req.query.user_id : ", req.query.user_id);
    
    const query = "SELECT * FROM coupon_categories WHERE user_id = $1";
    
    try {
      const result = await db.query(query, [req.query.user_id]);
      res.send(result.rows);
    } catch (err) {
      res.status(500).send(err);
    }
  });

  // 🟢 카테고리 추가 API
  router.post("/", async (req, res) => {
    const { name, user_id } = req.body;
    
    if (!name || !user_id) {
      return res.status(400).send("필수 파라미터가 누락되었습니다.");
    }

    const query = "INSERT INTO coupon_categories (name, user_id) VALUES ($1, $2) RETURNING id";

    try {
      const result = await db.query(query, [name, user_id]);
      res.status(200).json({ message: "카테고리 추가 완료", id: result.rows[0].id });
    } catch (err) {
      console.error("카테고리 추가 에러:", err);
      res.status(500).send("서버 에러가 발생했습니다.");
    }
  });

  // 🟢 카테고리 수정 API
  router.put("/:id", async (req, res) => {
    const { name } = req.body;
    const categoryId = req.params.id;

    const query = "UPDATE coupon_categories SET name = $1 WHERE id = $2";

    try {
      const result = await db.query(query, [name, categoryId]);

      if (result.rowCount === 0) {
        return res.status(404).send("카테고리를 찾을 수 없습니다.");
      }

      res.status(200).send("카테고리 수정 완료");
    } catch (err) {
      res.status(500).send(err);
    }
  });

  // 🟢 카테고리 삭제 API
  router.delete("/:id", async (req, res) => {
    const categoryId = req.params.id;
    const query = "DELETE FROM coupon_categories WHERE id = $1";

    try {
      const result = await db.query(query, [categoryId]);

      if (result.rowCount === 0) {
        return res.status(404).send("카테고리를 찾을 수 없습니다.");
      }

      res.status(200).send("카테고리 삭제 완료");
    } catch (err) {
      res.status(500).send(err);
    }
  });

  return router;
};
