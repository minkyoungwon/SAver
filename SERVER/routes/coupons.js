const express = require('express');
const router = express.Router();
const { extractBarcodeAndText } = require('../util');
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/coupons/') // 업로드 디렉토리
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, uniqueSuffix + path.extname(file.originalname))
    }
});
const upload = multer({ storage: storage });

module.exports = (db) => {
    // 쿠폰 목록 조회
    router.get('/', (req, res) => {
        const { user_id } = req.query;
        const query = `
        SELECT 
            c.id,
            c.user_id,
            c.name,
            c.note,
            c.deadline,
            c.status,
            c.coupon_image as image,
            c.usage_location,
            GROUP_CONCAT(DISTINCT cc.name) as categories
        FROM coupons c
        LEFT JOIN coupon_category_realations ccr ON c.id = ccr.coupon_id
        LEFT JOIN coupon_categories cc ON cc.id = ccr.category_id
        WHERE c.user_id = ?
        GROUP BY c.id;`;
        db.query(query, [user_id], (err, result) => {
            if (err) {
                return res.status(500).send(err);
            }
            // GROUP_CONCAT으로 묶인 카테고리 문자열을 배열로 변환
            const formattedResult = result.map((coupon) => ({
                ...coupon,
                categories: coupon.categories ? coupon.categories.split(',') : [],
            }));
            res.send(formattedResult);
        });
    });
    router.post('/', upload.single('image'), (req, res) => {
        const { user_id, barcode, name, deadline, usage_location, note, status, newCategories } = req.body;
        // 영구 저장될 이미지 경로 생성
        const imagePath = req.file ? `/uploads/coupons/${req.file.filename}` : null;
        
        db.beginTransaction(async (err) => {
            if (err) {
                // 에러 발생 시 업로드된 파일 삭제
                if (req.file) {
                    await fs.unlink(req.file.path).catch(console.error);
                }
                return res.status(500).json({ error: '트랜잭션 시작 중 오류가 발생했습니다.' });
            }

            try {
                // 쿠폰 저장 시 이미지 경로 저장
                const [couponResult] = await db.promise().query(
                    'INSERT INTO coupons (user_id, barcode, name, deadline, usage_location, note, status, coupon_image) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
                    [user_id, barcode, name, deadline, usage_location, note, status, imagePath]
                );
                const couponId = couponResult.insertId;

                // 2. 새로운 카테고리들 저장
                if (newCategories && newCategories.length > 0) {
                    // JSON 문자열로 전달된 경우 파싱
                    const categories = typeof newCategories === 'string' 
                        ? JSON.parse(newCategories) 
                        : newCategories;

                    // 카테고리 생성
                    const categoryValues = categories.map(categoryName => [categoryName, user_id]);
                    const [categoryResult] = await db.promise().query(
                        'INSERT INTO coupon_categories (name, user_id) VALUES ?',
                        [categoryValues]
                    );

                    // 생성된 카테고리들과 쿠폰 연결
                    const startId = categoryResult.insertId;
                    const relationValues = categories.map((_, index) => 
                        [couponId, startId + index]
                    );
                    
                    await db.promise().query(
                        'INSERT INTO coupon_category_realations (coupon_id, category_id) VALUES ?',
                        [relationValues]
                    );
                }

                // 트랜잭션 커밋
                await db.promise().commit();
                res.status(200).json({ 
                    message: '쿠폰과 카테고리가 성공적으로 저장되었습니다.',
                    couponId: couponId
                });

            } catch (error) {
                // 에러 발생 시 업로드된 파일 삭제
                if (req.file) {
                    await fs.unlink(req.file.path).catch(console.error);
                }
                await db.promise().rollback();
                console.error('에러:', error);
                res.status(500).json({ error: '저장 중 오류가 발생했습니다.' });
            }
        });
    });
    router.post('/extract', upload.single('image'), async (req, res) => {
        try {
            if (!req.file) {
                return res.status(400).json({ error: '이미지 파일이 없습니다.' });
            }

            // 이미지 처리를 위해 버퍼로 읽기
            const imageBuffer = await fs.readFile(req.file.path);
            
            // 바코드와 텍스트 추출
            const couponInfo = await extractBarcodeAndText(imageBuffer);

            // 임시 파일 즉시 삭제
            await fs.unlink(req.file.path);

            if (!couponInfo) {
                return res.status(404).json({ error: '쿠폰 정보를 추출할 수 없습니다.' });
            }

            return res.json(couponInfo);
        } catch (error) {
            // 에러 발생 시 임시 파일 삭제 확실히 하기
            if (req.file) {
                await fs.unlink(req.file.path).catch(console.error);
            }
            console.error('쿠폰 정보 추출 중 오류:', error);
            return res.status(500).json({ error: '쿠폰 정보 처리 중 오류가 발생했습니다.' });
        }
    });
    // 쿠폰 삭제
    router.delete('/:coupon_id', (req, res) => {
        const { coupon_id } = req.params;
        const query = 'DELETE FROM coupons WHERE id = ?';

        db.query(query, [coupon_id], (err, result) => {
            if (err) {
                return res.status(500).json({ error: '쿠폰 삭제 중 오류가 발생했습니다.' });
            }
            if (result.affectedRows === 0) {
                return res.status(404).json({ error: '해당 쿠폰을 찾을 수 없습니다.' });
            }
            res.json({ message: '쿠폰이 성공적으로 삭제되었습니다.' });
        });
    });

    // 쿠폰 수정
    router.put('/:coupon_id', (req, res) => {
        const { coupon_id } = req.params;
        const { name, note, deadline, status, categories } = req.body;

        // 트랜잭션 시작
        db.beginTransaction((err) => {
            if (err) {
                return res.status(500).json({ error: '트랜잭션 시작 중 오류가 발생했습니다.' });
            }

            // 쿠폰 정보 업데이트
            const updateQuery = `
                UPDATE coupons 
                SET name = ?, note = ?, deadline = ?, status = ?
                WHERE id = ?`;

            db.query(updateQuery, [name, note, deadline, status, coupon_id], (err, result) => {
                if (err) {
                    return db.rollback(() => {
                        res.status(500).json({ error: '쿠폰 수정 중 오류가 발생했습니다.' });
                    });
                }

                if (result.affectedRows === 0) {
                    return db.rollback(() => {
                        res.status(404).json({ error: '해당 쿠폰을 찾을 수 없습니다.' });
                    });
                }

                // 기존 카테고리 관계 삭제
                const deleteRelationsQuery =
                    'DELETE FROM coupon_category_realations WHERE coupon_id = ?';
                db.query(deleteRelationsQuery, [coupon_id], (err) => {
                    if (err) {
                        return db.rollback(() => {
                            res.status(500).json({
                                error: '카테고리 관계 삭제 중 오류가 발생했습니다.',
                            });
                        });
                    }

                    // 새로운 카테고리 관계 추가
                    if (categories && categories.length > 0) {
                        const insertRelationsQuery =
                            'INSERT INTO coupon_category_realations (coupon_id, category_id) VALUES ?';
                        const values = categories.map((categoryId) => [coupon_id, categoryId]);

                        db.query(insertRelationsQuery, [values], (err) => {
                            if (err) {
                                return db.rollback(() => {
                                    res.status(500).json({
                                        error: '카테고리 관계 추가 중 오류가 발생했습니다.',
                                    });
                                });
                            }

                            // 트랜잭션 커밋
                            db.commit((err) => {
                                if (err) {
                                    return db.rollback(() => {
                                        res.status(500).json({
                                            error: '트랜잭션 커밋 중 오류가 발생했습니다.',
                                        });
                                    });
                                }
                                res.json({ message: '쿠폰이 성공적으로 수정되었습니다.' });
                            });
                        });
                    } else {
                        // 카테고리가 없는 경우 바로 커밋
                        db.commit((err) => {
                            if (err) {
                                return db.rollback(() => {
                                    res.status(500).json({
                                        error: '트랜잭션 커밋 중 오류가 발생했습니다.',
                                    });
                                });
                            }
                            res.json({ message: '쿠폰이 성공적으로 수정되었습니다.' });
                        });
                    }
                });
            });
        });
    });

    return router;
};
