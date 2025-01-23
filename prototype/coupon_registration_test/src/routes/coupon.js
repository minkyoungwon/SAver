const express = require('express');
const multer = require('multer');
const router = express.Router();
const { extractBarcodeAndText } = require('../services/scanner');

//multer 메모리 스토리지 설정
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// 바코드 처리 요청
router.post('/', upload.single('image'), async (req, res) => {
    console.log('파일 요청 받음', req.file);
    try {
        if (!req.file) {
            //req.file 파일 정보 담겨 있음
            return res.send(400).json({ message: '파일이 첨부되지 않았습니다' });
        }
        // 전달 받은 이미지 파일을 함수 인수로 전달
        const scanResult = await extractBarcodeAndText(req.file.buffer);

        // 추출한 바코드 번호호 및 텍스트 다시 프론트로 전달
        res.json(scanResult);
    } catch (error) {
        res.status(500).json({ success: false, message: error });
    }
});

module.exports = router;
