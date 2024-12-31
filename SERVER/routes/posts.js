const express = require('express');
const router = express.Router();

module.exports = (db) => {
    // 글 작성
router.post("/", (req, res) => {
  const { title, content, author } = req.body; // author 추가
const query = "INSERT INTO posts (title, content, author) VALUES (?, ?, ?)";
db.query(query, [title, content, author], (err, result) => {
  if (err) {
    return res.status(500).send(err);
  }
  res.status(201).send({ id: result.insertId, title, content, author });
});
});

// 글 목록 조회
router.get("/", (req, res) => {
  const query =
  'SELECT id, title, user_id, DATE_FORMAT(created_at, "%Y-%m-%d %H:%i:%s") as created_at FROM posts ORDER BY created_at DESC';

db.query(query, (err, results) => {
  if (err) {
    return res.status(500).send(err);
  }
  res.send(results);
});
});

// 글 상세 조회
router.get("/:id", (req, res) => {
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

// 글 삭제
router.delete("/:id", (req, res) => {
  const { id } = req.params;
const query = "DELETE FROM posts WHERE id = ?";

db.query(query, [id], (err, result) => {
  if (err) {
    return res.status(500).send(err);
  }
  res.status(200).send({ message: "글이 삭제되었습니다." });
});
});

// 글 수정
router.put("/:id", (req, res) => {
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

// 댓글 작성
router.post("/comments", (req, res) => {
  const { postId, text } = req.body;
const query = "INSERT INTO comments (post_id, text) VALUES (?, ?)";

db.query(query, [postId, text], (err, result) => {
  if (err) {
    return res.status(500).send(err);
  }
  res.status(201).send({ id: result.insertId, postId, text });
});
});

// 댓글 조회
router.get("/comments/:postId", (req, res) => {
  const { postId } = req.params;
  const query = "SELECT * FROM comments WHERE post_id = ?";

  db.query(query, [postId], (err, results) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.send(results);
  });
});

    return router;
}