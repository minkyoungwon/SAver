const express = require("express");
const router = express.Router();
const { authenticateToken } = require("./auth");
const db = require("../db")

// 유저 검색 API
router.get("/search", authenticateToken, (req, res) => {
	const { query } = req.query;
	console.log("검색 요청 결과값 => :", query);
  
	if (!query) {
	  return res.status(400).send({ message: "검색어를 입력하세요." });
	}
  
	const sql = "SELECT id, email FROM users WHERE email LIKE ?";
	db.query(sql, [`%${query}%`], (err, results) => {
	  if (err) {
		return res.status(500).send({ message: "DB 오류가 발생했습니다.", error: err });
	  }
	  console.log("검색 결과 => ", results); // 쿼리 결과 로그 추가
	  res.json(results);
	});
  });

  // 메시지 보내기 및 저장
router.post("/send", authenticateToken, (req, res) => {
	const { receiverId, content } = req.body;
	const senderId = req.user.id; // JWT에서 가져온 사용자 ID
  
	if (!receiverId || !content) {
	  return res.status(400).send({ message: "잘못된 요청입니다. 수신자와 내용을 확인하세요." });
	}
  
	const query = "INSERT INTO dm_direct_messages (sender_id, receiver_id, content) VALUES (?, ?, ?)";
	db.query(query, [senderId, receiverId, content], (err, result) => {
	  if (err) {
		console.error("메시지 저장 중 오류 발생:", err);
		return res.status(500).send({ message: "메시지 저장 중 오류가 발생했습니다.", error: err });
	  }
	  console.log("메시지 저장 성공:", result);
	  res.status(201).send({
		message: "메시지가 성공적으로 저장되었습니다.",
		data: { id: result.insertId, senderId, receiverId, content },
	  });
	});
  });
  
  
// 대화 기록 조회
router.get("/:receiverId", authenticateToken, (req, res) => {
	const senderId = req.user.id;
	const { receiverId } = req.params;
  
	const query = `
	  SELECT sender_id, receiver_id, content, sent_at
	  FROM dm_direct_messages
	  WHERE (sender_id = ? AND receiver_id = ?)
		 OR (sender_id = ? AND receiver_id = ?)
	  ORDER BY sent_at ASC
	`;
  
	db.query(query, [senderId, receiverId, receiverId, senderId], (err, results) => {
	  if (err) {
		console.error("대화 기록 조회 중 오류 발생:", err);
		return res.status(500).send({ message: "대화 기록 조회 중 오류가 발생했습니다.", error: err });
	  }
	  res.send(results);
	});
  });
  

// 읽음 상태 업데이트
router.put("/read/:receiverId", authenticateToken, (req, res) => {
  const senderId = req.user.id;
  const { receiverId } = req.params;

  const query = `
    UPDATE dm_direct_messages
    SET is_read = 1
    WHERE sender_id = ? AND receiver_id = ?
  `;

  db.query(query, [receiverId, senderId], (err, result) => {
    if (err) {
      return res.status(500).send({ message: "읽음 상태 업데이트 중 오류가 발생했습니다.", error: err });
    }
    res.send({ message: "읽음 상태가 업데이트되었습니다." });
  });
});

module.exports = router;
