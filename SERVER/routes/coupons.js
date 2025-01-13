const express = require('express');
const router = express.Router();
const { extractBarcodeAndText } = require('../util');
const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

module.exports = (db) => {
    // 쿠폰 목록 조회
    router.get('/', (req, res) => {
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
    router.post('/', (req, res) => {
        console.log(req.body);
        const { userId, barcode, type, productName, expirationDate, storeName } = req.body;
        const query =
            'INSERT INTO coupons (user_id, barcode, type, name, deadline, usage_location) VALUES (?, ?, ?, ?, ?, ?, ?)';
        db.query(
            query,
            [userId, barcode, type, productName, expirationDate, storeName],
            (err, result) => {
                if (err) {
                    return res.status(500).send(err);
                }
                res.status(200).send('쿠폰 추가 완료');
            }
        );
    });
    router.post('/extract', upload.single('image'), async (req, res) => {
        try {
            if (!req.file) {
                return res.status(400).json({ error: '이미지 파일이 없습니다.' });
            }

            const image = req.file.buffer;
            const couponInfo = await extractBarcodeAndText(image);

            console.log('서버에서 처리된 쿠폰 정보:', couponInfo);

            if (!couponInfo) {
                return res.status(404).json({ error: '쿠폰 정보를 추출할 수 없습니다.' });
            }

            return res.json(couponInfo);
        } catch (error) {
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
