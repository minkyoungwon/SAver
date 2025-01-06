const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const { authenticateToken } = require('./auth');
const db = require('../db');

// 비밀번호 확인 및 변경
router.put("/change", authenticateToken, async (req, res) => {
	const userId = req.user.id; // authenticateToken 미들웨어가 토큰 디코딩 결과를 넣어 줌
	const { currentPassword, newPassword } = req.body;
	
  
	try {
	  const query = "SELECT password FROM users WHERE id = ?";
	  db.query(query, [userId], async (err, results) => {
		if (err) {
		  console.error("DB 조회 중 오류:", err);
		  return res.status(500).send({ message: "서버 오류가 발생했습니다." });
		}
  
		if (results.length === 0) {
		  return res.status(404).send({ message: "사용자를 찾을 수 없습니다." });
		}
  
		const hashedPassword = results[0].password;
  
		// 디버깅용 로그 추가
		console.log("입력된 비밀번호:", currentPassword); // 사용자가 입력한 비밀번호 출력
		console.log("DB에 저장된 해시 값:", hashedPassword); // 데이터베이스의 해시된 비밀번호 출력
  
		const isMatch = await bcrypt.compare(currentPassword, hashedPassword);
  
		// 비교 결과 로그 추가
		console.log("비밀번호 비교 결과:", isMatch); // true 또는 false 출력
  
		if (!isMatch) {
		  return res.status(400).send({ message: "현재 비밀번호가 일치하지 않습니다." });
		}
  
		const newHashedPassword = await bcrypt.hash(newPassword, 10);
		const updateQuery = "UPDATE users SET password = ? WHERE id = ?";
		db.query(updateQuery, [newHashedPassword, userId], (updateErr) => {
		  if (updateErr) {
			console.error("비밀번호 변경 중 오류:", updateErr);
			return res.status(500).send({ message: "비밀번호 변경 중 오류가 발생했습니다." });
		  }
		  res.send({ message: "비밀번호가 성공적으로 변경되었습니다." });
		});
	  });
	} catch (error) {
	  console.error("비밀번호 처리 중 오류:", error);
	  res.status(500).send({ message: "비밀번호 변경 중 오류가 발생했습니다." });
	}
  });
  

  
module.exports = router;
