const express = require('express');
const router = express.Router();
const { authenticateToken } = require('./auth');


module.exports = (db) => {
    // 글 작성
router.post("/", authenticateToken, (req, res) => {
  const { title, content } = req.body;
  const userId = req.user.id; // 인증된 사용자 ID
  const author = req.user.email.split('@')[0]; // 이메일에서 ID 추출
  const query = "INSERT INTO posts (title, content, author, user_id) VALUES (?, ?, ?, ?)";

  db.query(query, [title, content, author, userId], (err, result) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.status(201).send({ id: result.insertId, title, content, author });
  });
});


// 글 목록 조회
router.get("/", (req, res) => {
  const query =
  // 'SELECT id, title, user_id, DATE_FORMAT(created_at,
  //  "%Y-%m-%d %H:%i:%s") as created_at FROM posts ORDER BY created_at DESC';
   `SELECT id, title, user_id, author, 
  DATE_FORMAT(posted_at, "%Y-%m-%d %H:%i:%s") as posted_at, view_count, is_hidden 
  FROM posts 
  ORDER BY posted_at DESC`; // 12.31 쿼리 수정

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
  const query = `
    SELECT * FROM posts WHERE id = ?
  `;
  const incrementViewCount = `
    UPDATE posts SET view_count = view_count + 1 WHERE id = ?
  `;

  db.query(query, [id], (err, results) => {
    if (err) {
      return res.status(500).send(err);
    }
    if (results.length === 0) {
      return res.status(404).send({ message: "게시글을 찾을 수 없습니다." });
    }

    db.query(incrementViewCount, [id], (updateErr) => {
      if (updateErr) {
        console.error("조회수 증가 중 오류:", updateErr);
      }
    });

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