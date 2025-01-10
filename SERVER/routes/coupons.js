const express = require('express');
const router = express.Router();
const {extractBarcodeAndText} = require('../util');
const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

module.exports = (db) => {
    // 쿠폰 목록 조회
    router.get("/", (req, res) => {
        const { user_id } = req.query;
        const query = `
        SELECT 
            c.id as coupon_id,
            c.user_id,
            c.name,
            c.note,
            c.deadline,
            c.status,
            c.coupon_image,
            GROUP_CONCAT(DISTINCT cc.name) as categories
        FROM coupons c
        LEFT JOIN coupon_category_realations ccr ON c.id = ccr.coupon_id
        LEFT JOIN coupon_categories cc ON cc.id = ccr.category_id
        WHERE c.user_id = ?
        GROUP BY c.id;`;
        db.query(query, [user_id], (err, result) => {
            if(err) {
                return res.status(500).send(err);
            }
            // GROUP_CONCAT으로 묶인 카테고리 문자열을 배열로 변환
            const formattedResult = result.map(coupon => ({
                ...coupon,
                categories: coupon.categories ? coupon.categories.split(',') : []
            }));
            console.log("formattedResult : ", formattedResult);
            res.send(formattedResult);
        });
    });
    router.post("/", (req, res) => {
        const [userId, barcode, type, productName, expiryDate, storeName, orderNumber] = req.body;
        const query = "INSERT INTO coupons (userId, barcode, type, productName, expiryDate, storeName, orderNumber) VALUES (?, ?, ?, ?, ?, ?, ?)";
        db.query(query, [userId, barcode, type, productName, expiryDate, storeName, orderNumber], (err, result) => {
            if(err) {
                return res.status(500).send(err);
            }
            res.send(result);
        })
    })
    router.post("/extract", upload.single('image'), async (req, res) => {
        try {
            if (!req.file) {
                return res.status(400).json({ error: '이미지 파일이 없습니다.' });
            }

            const image = req.file.buffer;
            const couponInfo = await extractBarcodeAndText(image);
            
            console.log("서버에서 처리된 쿠폰 정보:", couponInfo);
            
            if (!couponInfo) {
                return res.status(404).json({ error: '쿠폰 정보를 추출할 수 없습니다.' });
            }

            return res.json(couponInfo);
        } catch (error) {
            console.error('쿠폰 정보 추출 중 오류:', error);
            return res.status(500).json({ error: '쿠폰 정보 처리 중 오류가 발생했습니다.' });
        }
    })
    return router;
}