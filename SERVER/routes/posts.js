const express = require('express');
const router = express.Router();
const { authenticateToken } = require('./auth');

module.exports = (db) => {
  // 글 작성
  router.post("/", authenticateToken, async (req, res) => {
    const { title, content } = req.body;
    const userId = req.user.id;
    const author = req.user.email.split('@')[0];

    const query = `
            INSERT INTO posts (title, content, author, user_id) 
            VALUES ($1, $2, $3, $4) RETURNING id
        `;

    try {
      const result = await db.query(query, [title, content, author, userId]);
      res.status(201).send({ id: result.rows[0].id, title, content, author });
    } catch (err) {
      res.status(500).send(err);
    }
  });

  // 글 목록 조회
  router.get("/", async (req, res) => {
    const query = `
            SELECT id, title, user_id, author, 
            TO_CHAR(posted_at, 'YYYY-MM-DD HH24:MI:SS') as posted_at, 
            view_count, is_hidden 
            FROM posts 
            ORDER BY posted_at DESC
        `;

    try {
      const results = await db.query(query);
      res.send(results.rows);
    } catch (err) {
      res.status(500).send(err);
    }
  });

  // 글 상세 조회
  router.get("/:id", async (req, res) => {
    const { id } = req.params;

    const query = `SELECT * FROM posts WHERE id = $1`;
    const incrementViewCount = `UPDATE posts SET view_count = view_count + 1 WHERE id = $1`;

    try {
      const results = await db.query(query, [id]);
      if (results.rows.length === 0) {
        return res.status(404).send({ message: "게시글을 찾을 수 없습니다." });
      }

      await db.query(incrementViewCount, [id]);
      res.send(results.rows[0]);
    } catch (err) {
      res.status(500).send(err);
    }
  });

  // 글 삭제
  router.delete("/:id", async (req, res) => {
    const { id } = req.params;
    const query = "DELETE FROM posts WHERE id = $1";

    try {
      const result = await db.query(query, [id]);
      if (result.rowCount === 0) {
        return res.status(404).send({ message: "삭제할 게시글이 없습니다." });
      }
      res.status(200).send({ message: "글이 삭제되었습니다." });
    } catch (err) {
      res.status(500).send(err);
    }
  });

  // 글 수정
  router.put("/:id", async (req, res) => {
    const { id } = req.params;
    const { title, content } = req.body;
    const query = "UPDATE posts SET title = $1, content = $2 WHERE id = $3";

    try {
      const result = await db.query(query, [title, content, id]);
      if (result.rowCount === 0) {
        return res.status(404).send({ message: "수정할 게시글이 없습니다." });
      }
      res.status(200).send({ message: "글이 수정되었습니다." });
    } catch (err) {
      res.status(500).send(err);
    }
  });


  // 댓글 작성
  router.post("/comments", authenticateToken, async (req, res) => {
    const { postId, content } = req.body;
    const userId = req.user.id;

    const query = `
      INSERT INTO comments (post_id, user_id, content) 
      VALUES ($1, $2, $3) RETURNING id, posted_at
  `;

    try {
      const result = await db.query(query, [postId, userId, content]);
      res.status(201).send({
        id: result.rows[0].id,
        postId,
        userId,
        content,
        posted_at: result.rows[0].posted_at
      });
    } catch (err) {
      res.status(500).send(err);
    }
  });

  // 댓글 조회
  router.get("/comments/:postId", async (req, res) => {
    const { postId } = req.params;
    const query = `
      SELECT 
          c.id, 
          c.post_id, 
          c.content, 
          TO_CHAR(c.posted_at, 'YYYY-MM-DD HH24:MI:SS') as created_at, 
          c.parent_id,
          c.depth,
          u.email AS user_email
      FROM comments c
      LEFT JOIN users u ON c.user_id = u.id
      WHERE c.post_id = $1
      ORDER BY c.posted_at ASC
  `;

    try {
      const results = await db.query(query, [postId]);
      res.send(results.rows);
    } catch (err) {
      res.status(500).send(err);
    }
  });

  // 대댓글 작성
  router.post("/comments/reply", authenticateToken, async (req, res) => {
    const { postId, content, parentId, depth } = req.body;
    const userId = req.user.id;
    const finalDepth = depth ?? 0;

    const query = `
      INSERT INTO comments (post_id, user_id, content, parent_id, depth) 
      VALUES ($1, $2, $3, $4, $5) RETURNING id, posted_at
  `;

    try {
      const result = await db.query(query, [postId, userId, content, parentId, finalDepth]);
      res.status(201).send({
        id: result.rows[0].id,
        postId,
        userId,
        content,
        parentId,
        depth: finalDepth,
        posted_at: result.rows[0].posted_at
      });
    } catch (err) {
      res.status(500).send(err);
    }
  });

  // 댓글 삭제
  router.delete("/comments/:commentId", authenticateToken, async (req, res) => {
    const commentId = req.params.commentId;
    const userId = req.user.id;

    const query = "DELETE FROM comments WHERE id = $1 AND user_id = $2";

    try {
      const result = await db.query(query, [commentId, userId]);
      if (result.rowCount === 0) {
        return res.status(403).send({ message: "삭제 권한이 없습니다." });
      }
      res.send({ message: "댓글이 삭제되었습니다." });
    } catch (err) {
      res.status(500).send(err);
    }
  });

  // 댓글 수정
  router.put("/comments/:commentId", authenticateToken, async (req, res) => {
    const commentId = req.params.commentId;
    const userId = req.user.id;
    const { content } = req.body;

    const query = "UPDATE comments SET content = $1 WHERE id = $2 AND user_id = $3";

    try {
      const result = await db.query(query, [content, commentId, userId]);
      if (result.rowCount === 0) {
        return res.status(403).send({ message: "수정 권한이 없습니다." });
      }
      res.send({ message: "댓글이 수정되었습니다." });
    } catch (err) {
      res.status(500).send(err);
    }
  });



  return router;
};

