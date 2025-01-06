

const express = require('express');
const router = express.Router();
const db = require('../db');

// 검색 엔드포인트 추가
router.get("/", (req, res) => {
	const { query } = req.query;
	//console.log("검색 요청 수신:", query); // 요청 확인용 로그
  
	const sqlQuery = `
	  SELECT id, title, content, author, DATE_FORMAT(posted_at, "%Y-%m-%d %H:%i:%s") as posted_at
	  FROM posts
	  WHERE title LIKE ? OR content LIKE ? OR author LIKE ?
	  ORDER BY posted_at DESC
	`;
	const searchQuery = `%${query}%`;
  
	db.query(sqlQuery, [searchQuery, searchQuery, searchQuery], (err, results) => {
		if (err) {
			//console.error("DB 에러:", err);
			//console.log("SQL 쿼리:", sqlQuery);
			return res.status(500).json({ error: "Database error" });
		}
		//console.log("검색 결과:", results);
		res.json(results);
	});
	
  });
  

  module.exports = router;
  //module.exports.createRouter = () => router
  
  