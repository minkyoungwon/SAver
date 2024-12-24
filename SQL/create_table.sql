
CREATE TABLE IF NOT EXISTS comments
(
  id        INT   AUTO_INCREMENT COMMENT 'Auto increment',
  content   TEXT  NULL     COMMENT '내용',
  is_hidden BOOLEAN  NULL     COMMENT '숨김표시',
  posted_at DATETIME NULL     COMMENT '작성날짜',
  post_id   INT      NOT NULL COMMENT '게시물id',
  user_id   INT      NOT NULL COMMENT '사용자id',
  depth     INT      NULL     COMMENT '댓글 계층/깊이 (depth>=0)',
  parent_id INT      NULL     COMMENT 'depth>=1 부모댓글 id',
  PRIMARY KEY (id)
) COMMENT '댓글';

CREATE TABLE IF NOT EXISTS coupon_categories
(
  id      INT  AUTO_INCREMENT COMMENT 'Auto increment',
  name    TEXT NULL     COMMENT '카테고리명',
  user_id INT     NOT NULL COMMENT '사용자id',
  PRIMARY KEY (id)
) COMMENT '쿠폰 카테고리';

CREATE TABLE IF NOT EXISTS coupon_category_realations
(
  id          INT AUTO_INCREMENT COMMENT 'Auto increment',
  category_id INT NOT NULL COMMENT '카테고리id',
  coupon_id   INT NOT NULL COMMENT '쿠폰id',
  PRIMARY KEY (id)
) COMMENT '쿠폰 카테고리-쿠폰';

CREATE TABLE IF NOT EXISTS coupons
(
  id              INT  AUTO_INCREMENT COMMENT 'Auto increment',
  name            TEXT NULL     COMMENT '상품명',
  usage_location  TEXT NULL     COMMENT '사용처',
  note            TEXT NULL     COMMENT '메모',
  deadline        DATE    NULL     COMMENT '만료일',
  usage_date      DATE    NULL     COMMENT '사용일',
  monetary_coupon BOOLEAN NULL     COMMENT '금액권여부',
  charge_amount   INT     NULL     COMMENT '금액권일 경우',
  balance         INT     NULL     COMMENT '금액권인 경우',
  coupon_image    TEXT NULL     COMMENT '이미지 URL',
  barcode         TEXT NULL    ,
  PRIMARY KEY (id)
) COMMENT '쿠폰';

CREATE TABLE IF NOT EXISTS post_images
(
  id         INT  AUTO_INCREMENT COMMENT 'Auto increment',
  post_image TEXT NULL     COMMENT 'image url',
  post_id    INT     NOT NULL COMMENT 'Auto increment',
  PRIMARY KEY (id)
) COMMENT '이미지';

CREATE TABLE IF NOT EXISTS posts
(
  id         INT   AUTO_INCREMENT COMMENT 'Auto increment',
  title      TEXT  NULL     COMMENT '제목',
  content    TEXT     NULL     COMMENT '내용',
  user_id    INT      NOT NULL COMMENT '작성자 ',
  view_count INT      NULL     COMMENT '조회수',
  is_hidden  BOOLEAN  NULL     COMMENT '숨김표시',
  posted_at  DATETIME NULL     COMMENT '작성날짜',
  PRIMARY KEY (id)
) COMMENT '게시판';

CREATE TABLE IF NOT EXISTS users
(
  id            INT   AUTO_INCREMENT COMMENT 'Auto increment',
  email         TEXT  NOT NULL COMMENT '이메일',
  password      TEXT  NOT NULL COMMENT '비밀번호',
  join_date     DATETIME NULL     COMMENT '가입일자',
  profile_image TEXT  NULL     COMMENT '프로필 이미지',
  adminFlag		BOOLEAN DEFAULT false comment '관리자여부',
  PRIMARY KEY (id)
) COMMENT '사용자(관리자 여부 추가)';

ALTER TABLE posts
  ADD CONSTRAINT FK_users_TO_posts
    FOREIGN KEY (user_id)
    REFERENCES users (id);

ALTER TABLE comments
  ADD CONSTRAINT FK_posts_TO_comments
    FOREIGN KEY (post_id)
    REFERENCES posts (id);

ALTER TABLE comments
  ADD CONSTRAINT FK_users_TO_comments
    FOREIGN KEY (user_id)
    REFERENCES users (id);

ALTER TABLE post_images
  ADD CONSTRAINT FK_posts_TO_post_images
    FOREIGN KEY (post_id)
    REFERENCES posts (id);

ALTER TABLE coupon_categories
  ADD CONSTRAINT FK_users_TO_coupon_categories
    FOREIGN KEY (user_id)
    REFERENCES users (id);

ALTER TABLE coupon_category_realations
  ADD CONSTRAINT FK_coupons_TO_coupon_category_realations
    FOREIGN KEY (coupon_id)
    REFERENCES coupons (id);

ALTER TABLE coupon_category_realations
  ADD CONSTRAINT FK_coupon_categories_TO_coupon_category_realations
    FOREIGN KEY (category_id)
    REFERENCES coupon_categories (id);