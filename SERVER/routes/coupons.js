const express = require('express');
const router = express.Router();
const { extractBarcodeAndText } = require('../util');
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;
const db = require('../db');

// 🟢 파일 업로드 설정
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/coupons/'),
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});
const upload = multer({ storage });

// 🟢 쿠폰 목록 조회
router.get('/', async (req, res) => {
    const { user_id } = req.query;

    const query = `
        SELECT 
            c.id,
            c.user_id,
            c.name,
            c.note,
            c.deadline,
            c.status,
            c.coupon_image AS image,
            c.usage_location,
            STRING_AGG(DISTINCT cc.name, ',') AS categories
        FROM coupons c
        LEFT JOIN coupon_category_realations ccr ON c.id = ccr.coupon_id
        LEFT JOIN coupon_categories cc ON cc.id = ccr.category_id
        WHERE c.user_id = $1
        GROUP BY c.id;
    `;

    try {
        const result = await db.query(query, [user_id]);
        const formattedResult = result.rows.map(coupon => ({
            ...coupon,
            categories: coupon.categories ? coupon.categories.split(',') : [],
        }));
        res.send(formattedResult);
    } catch (err) {
        res.status(500).send(err);
    }
});

// 🟢 쿠폰 등록 (트랜잭션 적용)
router.post('/', upload.single('image'), async (req, res) => {
    const { user_id, barcode, name, deadline, usage_location, note, status, newCategories } = req.body;
    const imagePath = req.file ? `/uploads/coupons/${req.file.filename}` : null;

    try {
        await db.query('BEGIN'); // 트랜잭션 시작

        // 1️⃣ 쿠폰 추가
        const couponResult = await db.query(
            `INSERT INTO coupons (user_id, barcode, name, deadline, usage_location, note, status, coupon_image) 
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id`,
            [user_id, barcode, name, deadline, usage_location, note, status, imagePath]
        );
        const couponId = couponResult.rows[0].id;

        // 2️⃣ 새로운 카테고리 저장 및 연결
        if (newCategories && newCategories.length > 0) {
            const categories = typeof newCategories === 'string' ? JSON.parse(newCategories) : newCategories;

            // 새 카테고리 추가
            const categoryResult = await db.query(
                `INSERT INTO coupon_categories (name, user_id) 
                 VALUES ${categories.map((_, i) => `($${i * 2 + 1}, $${i * 2 + 2})`).join(',')} 
                 RETURNING id`,
                categories.flatMap(category => [category, user_id])
            );

            // 쿠폰과 카테고리 연결
            const relationValues = categoryResult.rows.map(row => [couponId, row.id]);
            await db.query(
                `INSERT INTO coupon_category_realations (coupon_id, category_id) 
                 VALUES ${relationValues.map((_, i) => `($${i * 2 + 1}, $${i * 2 + 2})`).join(',')}`,
                relationValues.flat()
            );
        }

        await db.query('COMMIT'); // 트랜잭션 커밋
        res.status(200).json({ message: '쿠폰과 카테고리가 성공적으로 저장되었습니다.', couponId });
    } catch (error) {
        await db.query('ROLLBACK'); // 롤백
        if (req.file) await fs.unlink(req.file.path).catch(console.error);
        console.error('에러:', error);
        res.status(500).json({ error: '저장 중 오류가 발생했습니다.' });
    }
});

// 🟢 쿠폰 삭제
router.delete('/:coupon_id', async (req, res) => {
    const { coupon_id } = req.params;

    try {
        const result = await db.query('DELETE FROM coupons WHERE id = $1', [coupon_id]);
        if (result.rowCount === 0) {
            return res.status(404).json({ error: '해당 쿠폰을 찾을 수 없습니다.' });
        }
        res.json({ message: '쿠폰이 성공적으로 삭제되었습니다.' });
    } catch (err) {
        res.status(500).json({ error: '쿠폰 삭제 중 오류가 발생했습니다.' });
    }
});

// 🟢 쿠폰 수정
router.put('/:coupon_id', async (req, res) => {
    const { coupon_id } = req.params;
    const { name, note, deadline, status, categories } = req.body;

    try {
        await db.query('BEGIN'); // 트랜잭션 시작

        // 1️⃣ 쿠폰 정보 업데이트
        const updateResult = await db.query(
            `UPDATE coupons 
             SET name = $1, note = $2, deadline = $3, status = $4
             WHERE id = $5`,
            [name, note, deadline, status, coupon_id]
        );

        if (updateResult.rowCount === 0) {
            await db.query('ROLLBACK');
            return res.status(404).json({ error: '해당 쿠폰을 찾을 수 없습니다.' });
        }

        // 2️⃣ 기존 카테고리 관계 삭제
        await db.query('DELETE FROM coupon_category_realations WHERE coupon_id = $1', [coupon_id]);

        // 3️⃣ 새로운 카테고리 연결
        if (categories && categories.length > 0) {
            const relationValues = categories.map(categoryId => [coupon_id, categoryId]);
            await db.query(
                `INSERT INTO coupon_category_realations (coupon_id, category_id) 
                 VALUES ${relationValues.map((_, i) => `($${i * 2 + 1}, $${i * 2 + 2})`).join(',')}`,
                relationValues.flat()
            );
        }

        await db.query('COMMIT'); // 트랜잭션 커밋
        res.json({ message: '쿠폰이 성공적으로 수정되었습니다.' });
    } catch (err) {
        await db.query('ROLLBACK'); // 롤백
        res.status(500).json({ error: '쿠폰 수정 중 오류가 발생했습니다.' });
    }
});

// 🟢 바코드 및 텍스트 추출
router.post('/extract', upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: '이미지 파일이 없습니다.' });
        }

        const imageBuffer = await fs.readFile(req.file.path);
        const couponInfo = await extractBarcodeAndText(imageBuffer);
        await fs.unlink(req.file.path);

        if (!couponInfo) {
            return res.status(404).json({ error: '쿠폰 정보를 추출할 수 없습니다.' });
        }
        res.json(couponInfo);
    } catch (error) {
        if (req.file) await fs.unlink(req.file.path).catch(console.error);
        res.status(500).json({ error: '쿠폰 정보 처리 중 오류가 발생했습니다.' });
    }
});

module.exports = router;
