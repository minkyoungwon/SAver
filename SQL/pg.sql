-- 1) users
DROP TABLE IF EXISTS users CASCADE;

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,      -- UNIQUE로 선언
  password VARCHAR(255) NOT NULL,
  join_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  profile_image VARCHAR(255),
  adminFlag BOOLEAN NOT NULL DEFAULT false, -- tinyint(1) → BOOLEAN
  is_verified BOOLEAN DEFAULT false,        -- tinyint(1) → BOOLEAN
  role VARCHAR(10) DEFAULT 'NORMAL' CHECK (role IN ('NORMAL','SOCIAL','ADMIN')) 
  -- MySQL의 enum('NORMAL','SOCIAL','ADMIN') 대체
);

-- 2) posts
DROP TABLE IF EXISTS posts CASCADE;

CREATE TABLE posts (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  user_id INT NOT NULL,  -- FK -> users(id)
  view_count INT DEFAULT 0,
  is_hidden BOOLEAN NOT NULL DEFAULT false, -- tinyint(1) → BOOLEAN
  posted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  author VARCHAR(100),
  CONSTRAINT posts_user_fk
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 3) comments
DROP TABLE IF EXISTS comments CASCADE;

CREATE TABLE comments (
  id SERIAL PRIMARY KEY,
  content TEXT,
  is_hidden BOOLEAN NOT NULL DEFAULT false,   -- tinyint(1) → BOOLEAN
  posted_at TIMESTAMP,                        -- datetime → timestamp
  post_id INT NOT NULL,                       -- FK -> posts(id)
  user_id INT NOT NULL,                       -- FK -> users(id)
  depth INT DEFAULT 0 CHECK (depth >= 0),
  parent_id INT,                              -- 자기 자신 테이블 참조
  CONSTRAINT FK_comments_parent_id  FOREIGN KEY (parent_id) REFERENCES comments(id),
  CONSTRAINT FK_posts_TO_comments   FOREIGN KEY (post_id)   REFERENCES posts(id) ON DELETE CASCADE,
  CONSTRAINT FK_users_TO_comments   FOREIGN KEY (user_id)   REFERENCES users(id) ON DELETE CASCADE
);

/* MySQL의 KEY idx_comments_post_id ~ 등은 아래 CREATE INDEX로 대체 */
CREATE INDEX idx_comments_post_id    ON comments (post_id);
CREATE INDEX idx_comments_user_id    ON comments (user_id);
CREATE INDEX idx_comments_parent_id  ON comments (parent_id);

-- 4) post_images
DROP TABLE IF EXISTS post_images CASCADE;

CREATE TABLE post_images (
  id SERIAL PRIMARY KEY,
  post_image VARCHAR(255),         -- 이미지 URL
  post_id INT NOT NULL,            -- FK -> posts(id)
  CONSTRAINT post_images_fk_post_id 
    FOREIGN KEY (post_id) REFERENCES posts(id)
);

-- 5) dm_direct_messages
DROP TABLE IF EXISTS dm_direct_messages CASCADE;

CREATE TABLE dm_direct_messages (
  id SERIAL PRIMARY KEY,
  sender_id VARCHAR(255) NOT NULL,           -- 참조: users.email
  receiver_id VARCHAR(255) NOT NULL,         -- 참조: users.email
  content TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,             -- tinyint(1) → BOOLEAN
  sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT dm_direct_messages_receiver_fk 
    FOREIGN KEY (receiver_id) REFERENCES users(email) ON DELETE CASCADE,
  CONSTRAINT dm_direct_messages_sender_fk  
    FOREIGN KEY (sender_id)   REFERENCES users(email) ON DELETE CASCADE
);

-- 추가 인덱스
CREATE INDEX dm_direct_messages_sender_idx   ON dm_direct_messages (sender_id);
CREATE INDEX dm_direct_messages_receiver_idx ON dm_direct_messages (receiver_id);

-- 6) coupons
DROP TABLE IF EXISTS coupons CASCADE;

CREATE TABLE coupons (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255),
  usage_location VARCHAR(255),
  note TEXT,
  deadline DATE,
  usage_date DATE,
  monetary_coupon BOOLEAN NOT NULL DEFAULT false,   -- tinyint(1) → BOOLEAN
  charge_amount INT,
  balance INT,
  coupon_image VARCHAR(255),
  barcode VARCHAR(255),
  status VARCHAR(255),
  user_id INT NOT NULL,                             -- FK -> users(id)
  type VARCHAR(255),
  "orderNumber" INT,         -- orderNumber 등 예약어 가능성 -> 큰따옴표
  CONSTRAINT coupons_user_fk FOREIGN KEY (user_id) REFERENCES users(id),
  CONSTRAINT CHK_coupons_balance_positive        CHECK (balance >= 0),
  CONSTRAINT CHK_coupons_charge_amount_positive  CHECK (charge_amount >= 0)
);

-- 7) coupon_categories
DROP TABLE IF EXISTS coupon_categories CASCADE;

CREATE TABLE coupon_categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255),
  user_id INT NOT NULL,        -- FK -> users(id)
  CONSTRAINT FK_users_TO_coupon_categories
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- 8) coupon_category_realations
DROP TABLE IF EXISTS coupon_category_realations CASCADE;

CREATE TABLE coupon_category_realations (
  id SERIAL PRIMARY KEY,
  category_id INT NOT NULL,  -- FK -> coupon_categories(id)
  coupon_id   INT NOT NULL,  -- FK -> coupons(id)
  CONSTRAINT coupon_category_realations_fk_category_id
    FOREIGN KEY (category_id) REFERENCES coupon_categories(id),
  CONSTRAINT coupon_category_realations_fk_coupon_id
    FOREIGN KEY (coupon_id)   REFERENCES coupons(id)
);

-- 9) social_accounts
DROP TABLE IF EXISTS social_accounts CASCADE;

CREATE TABLE social_accounts (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL,   -- FK -> users(id)
  provider VARCHAR(10) NOT NULL CHECK (provider IN ('google','naver')),
  social_id VARCHAR(255) NOT NULL,
  profile_image VARCHAR(255),
  CONSTRAINT social_accounts_user_fk 
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);




-- 추가 수정정
-- 1) users
DROP TABLE IF EXISTS users CASCADE;

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,      -- UNIQUE로 선언
  password VARCHAR(255) NOT NULL,
  join_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  profile_image VARCHAR(255),
  adminFlag BOOLEAN NOT NULL DEFAULT false, -- tinyint(1) → BOOLEAN
  is_verified BOOLEAN DEFAULT false,        -- tinyint(1) → BOOLEAN
  role VARCHAR(10) DEFAULT 'NORMAL' CHECK (role IN ('NORMAL','SOCIAL','ADMIN')), 
  -- MySQL의 enum('NORMAL','SOCIAL','ADMIN') 대체

  -- ▼▼ [신규] 이메일 인증용 칼럼 2개 추가 ▼▼
  verification_code VARCHAR(6),     -- 인증 코드 저장용
  verification_expires TIMESTAMP    -- 인증 코드 만료 시간
);

-- 2) posts
DROP TABLE IF EXISTS posts CASCADE;
CREATE TABLE posts (
);

-- 3) comments
DROP TABLE IF EXISTS comments CASCADE;
CREATE TABLE comments (
);

-- 이하 coupon, dm_direct_messages, social_accounts 등 기존과 동일
