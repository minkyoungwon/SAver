-- 1. 독립 테이블 (외래키 의존성이 없는 테이블)
CREATE TABLE IF NOT EXISTS users
(
  id            INT   AUTO_INCREMENT COMMENT 'Auto increment',
  email         VARCHAR(255) NOT NULL COMMENT '이메일',
  password      TEXT  NOT NULL COMMENT '비밀번호',
  join_date     DATETIME NULL     COMMENT '가입일자',
  profile_image VARCHAR(255)  NULL     COMMENT '프로필 이미지',
  adminFlag     BOOLEAN NOT NULL DEFAULT false COMMENT '관리자여부',
  PRIMARY KEY (id)
) COMMENT '사용자(관리자 여부 추가)';

-- 2. users 테이블에만 의존성이 있는 테이블들
CREATE TABLE IF NOT EXISTS posts
(
  id         INT   AUTO_INCREMENT COMMENT 'Auto increment',
  title      VARCHAR(255)  NULL     COMMENT '제목',
  content    TEXT     NULL     COMMENT '내용',
  user_id    INT      NOT NULL COMMENT '작성자 id',
  view_count INT      NULL     COMMENT '조회수',
  is_hidden  BOOLEAN  NOT NULL DEFAULT false COMMENT '숨김표시',
  posted_at  DATETIME NULL     COMMENT '작성날짜',
  PRIMARY KEY (id),
  FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
) COMMENT '게시판';

CREATE TABLE IF NOT EXISTS coupon_categories
(
  id      INT  AUTO_INCREMENT COMMENT 'Auto increment',
  name    VARCHAR(255) NULL     COMMENT '카테고리명',
  user_id INT     NOT NULL COMMENT '사용자id',
  PRIMARY KEY (id)
  FOREIGN KEY(user_id) REFERENCES users (id) 
) COMMENT '쿠폰 카테고리';

CREATE TABLE IF NOT EXISTS coupons
(
  id              INT  AUTO_INCREMENT COMMENT 'Auto increment',
  name            VARCHAR(255) NULL     COMMENT '상품명',
  usage_location  VARCHAR(255) NULL     COMMENT '사용처',
  note            TEXT NULL     COMMENT '메모',
  deadline        DATE    NULL     COMMENT '만료일',
  usage_date      DATE    NULL     COMMENT '사용일',
  coupon_image    VARCHAR(255) NULL     COMMENT '이미지 URL',
  barcode         VARCHAR(255) NULL     COMMENT '바코드',
  status          VARCHAR(255) NULL     COMMENT '상태',
  user_id         INT     NOT NULL COMMENT '사용자id',
  PRIMARY KEY (id),
  FOREIGN KEY (user_id) REFERENCES users (id),
  CONSTRAINT CHK_coupons_charge_amount_positive CHECK (charge_amount >= 0),
  CONSTRAINT CHK_coupons_balance_positive CHECK (balance >= 0)
) COMMENT '쿠폰';

-- 3. posts 테이블에 의존성이 있는 테이블들
CREATE TABLE IF NOT EXISTS post_images
(
  id         INT  AUTO_INCREMENT COMMENT 'Auto increment',
  post_image VARCHAR(255) NULL     COMMENT '이미지 URL',
  post_id    INT     NOT NULL COMMENT '게시물 id',
  PRIMARY KEY (id),
  FOREIGN KEY (post_id) REFERENCES posts (id)
) COMMENT '이미지';

CREATE TABLE IF NOT EXISTS comments
(
  id        INT   AUTO_INCREMENT COMMENT 'Auto increment',
  content   TEXT  NULL     COMMENT '내용',
  is_hidden BOOLEAN  NOT NULL DEFAULT false COMMENT '숨김표시',
  posted_at DATETIME NULL     COMMENT '작성날짜',
  post_id   INT      NOT NULL COMMENT '게시물id',
  user_id   INT      NOT NULL COMMENT '사용자id',
  depth     INT      NULL     COMMENT '댓글 계층/깊이 (depth>=0)',
  parent_id INT      NULL     COMMENT 'depth>=1 부모댓글 id',
  PRIMARY KEY (id),
  FOREIGN KEY (post_id) REFERENCES posts (id),
  FOREIGN KEY (user_id) REFERENCES users (id),
  CONSTRAINT CHK_comments_depth CHECK (depth >= 0)
) COMMENT '댓글';

-- 4. coupons와 coupon_categories에 의존성이 있는 테이블
CREATE TABLE IF NOT EXISTS coupon_category_realations
(
  id          INT AUTO_INCREMENT COMMENT 'Auto increment',
  category_id INT NOT NULL COMMENT '카테고리id',
  coupon_id   INT NOT NULL COMMENT '쿠폰id',
  PRIMARY KEY (id),
  FOREIGN KEY (category_id) REFERENCES coupon_categories (id),
  FOREIGN KEY (coupon_id) REFERENCES coupons (id)
) COMMENT '쿠폰 카테고리-쿠폰';

-- 5. 외래키 제약조건 추가
ALTER TABLE comments
  ADD CONSTRAINT FK_posts_TO_comments
    FOREIGN KEY (post_id)
    REFERENCES posts (id)
    ON DELETE CASCADE;

ALTER TABLE comments
  ADD CONSTRAINT FK_users_TO_comments
    FOREIGN KEY (user_id)
    REFERENCES users (id)
    ON DELETE CASCADE;

ALTER TABLE comments
  ADD CONSTRAINT FK_comments_parent_id
    FOREIGN KEY (parent_id)
    REFERENCES comments (id);

-- 6. 인덱스 생성
CREATE INDEX idx_comments_post_id ON comments (post_id);
CREATE INDEX idx_comments_user_id ON comments (user_id);
CREATE INDEX idx_comments_parent_id ON comments (parent_id);

ALTER TABLE coupon_categories
  ADD CONSTRAINT FK_users_TO_coupon_categories
    FOREIGN KEY (user_id)
    REFERENCES users (id);

CREATE INDEX idx_post_images_post_id ON post_images (post_id);

CREATE INDEX idx_coupon_category_relations_category_id ON coupon_category_realations (category_id);
CREATE INDEX idx_coupon_category_relations_coupon_id ON coupon_category_realations (coupon_id);
