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
router.post("/comments", authenticateToken, (req, res) => { // authenticateToken add 0103 mkw
  const { postId, content } = req.body;
  const userId = req.user.id; // 인증된 사용자 ID // add 0103 mkw
const query = "INSERT INTO comments (post_id, user_id, content) VALUES (?, ?, ?)"; // text -> content 및 user_id 추가 // put 0103 mkw

db.query(query, [postId,userId, content], (err, result) => {
  if (err) {
    return res.status(500).send(err);
  }
  res.status(201).send({ id: result.insertId, postId,userId, content,posted_at: new Date(), }); // add userId, posted_at // 0103 mkw 
});
});

// 댓글 조회
router.get("/comments/:postId", (req, res) => {
  const { postId } = req.params;
  const query = `
    SELECT 
      c.id, 
      c.post_id, 
      c.content, 
      c.posted_at AS created_at, 
      c.parent_id,
      c.depth,
      u.email AS user_email
    FROM comments c
    LEFT JOIN users u ON c.user_id = u.id
    WHERE c.post_id = ?
    ORDER BY c.posted_at ASC
  `;
  
  db.query(query, [postId], (err, results) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.send(results);
  });
});



// 대댓글 기능 //depth 부분 추가
router.post("/comments/reply", authenticateToken, (req, res) => {
  const { postId, content, parentId, depth } = req.body;
  const userId = req.user.id;
  
  //const query = "INSERT INTO comments (post_id, user_id, content, parent_id, depth) VALUES (?, ?, ?, ?, ?)";
  // const depth = parentId ? 1 : 0; // parentId가 있으면 대댓글로 간주

  // [추가 코드]: 클라이언트에서 넘어온 depth를 그대로 DB에 저장
  // 단, 혹시 depth 값이 없으면 0으로 처리(에러 방지).
  const finalDepth = depth ?? 0; 
  const query = "INSERT INTO comments (post_id, user_id, content, parent_id, depth) VALUES (?, ?, ?, ?, ?)";

  
  db.query(query, [postId, userId, content, parentId, finalDepth], (err, result) => {
      if (err) {
          return res.status(500).send(err);
      }
      res.status(201).send({
          id: result.insertId,
          postId,
          userId,
          content,
          parentId,
          depth,
          posted_at: new Date(),
      });
  });
});


// 대대댓글 삭제
router.delete("/comments/:commentId", authenticateToken, (req, res) => {
  const commentId = req.params.commentId;
  const userId = req.user.id; // JWT 토큰에서 가져온 로그인 유저 ID

  const query = "DELETE FROM comments WHERE id = ? AND user_id = ?";
  
  db.query(query, [commentId, userId], (err, result) => {
    if (err) {
      console.error("댓글 삭제 중 오류:", err);
      return res.status(500).send({ message: "서버 오류가 발생했습니다." });
    }
    if (result.affectedRows === 0) {
      return res.status(403).send({ message: "삭제 권한이 없습니다." });
    }
    res.send({ message: "댓글이 삭제되었습니다." });
  });
});

// 대대댓글 수정
router.put("/comments/:commentId", authenticateToken, (req, res) => {
  const commentId = req.params.commentId;
  const userId = req.user.id;
  const { content } = req.body;

  const query = "UPDATE comments SET content = ? WHERE id = ? AND user_id = ?";
  
  db.query(query, [content, commentId, userId], (err, result) => {
    if (err) {
      console.error("댓글 수정 중 오류:", err);
      return res.status(500).send({ message: "서버 오류가 발생했습니다." });
    }
    if (result.affectedRows === 0) {
      return res.status(403).send({ message: "수정 권한이 없습니다." });
    }
    res.send({ message: "댓글이 수정되었습니다." });
  });
});




    return router;
}