-- 1. coupon_categories와 coupons에 의존성이 있는 테이블 삭제
DROP TABLE IF EXISTS coupon_category_realations;

-- 2. posts에 의존성이 있는 테이블들 삭제
DROP TABLE IF EXISTS comments;
DROP TABLE IF EXISTS post_images;

-- 3. users에만 의존성이 있는 테이블들 삭제
DROP TABLE IF EXISTS posts;
DROP TABLE IF EXISTS coupon_categories;
DROP TABLE IF EXISTS coupons;

-- 4. 독립 테이블 삭제
DROP TABLE IF EXISTS users;