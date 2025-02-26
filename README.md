# Saver 프로젝트

## 🔗 [Saver 홈페이지](https://ssavert1.vercel.app/) 클릭시 이동
(프리티어 서버여서 가끔 404 에러 혹은 에러 발생시 로그인이나 새로고침 후에 사용해주세요)
- 회원 가입 가능

### 📝 **테스트용 계정**
| 이메일 | 비밀번호 |
|--------|-----------|
| kwkw0647@naver.com | 123456789 |
| kw0647@naver.com | 123456789 |

---

## 🛠 **기술 스택**
- **프론트엔드:** React (Vite)
- **백엔드:** Node.js (Express)
- **데이터베이스:** PostgreSQL (MySQL에서 마이그레이션)
- **빌드 도구:** Vite

---

## 🚀 **배포 환경**
| 서비스 | 플랫폼 |
|--------|------------|
| **프론트엔드** | [Vercel](https://vercel.com/) |
| **백엔드** | [Render](https://render.com/) |
| **데이터베이스** | [Supabase](https://supabase.com/) |

---

## 📌 **API 연결**
- 백엔드 API: [`https://saverback.onrender.com`](https://saverback.onrender.com)
- 프론트엔드에서 `.env` 파일에 추가할 환경 변수:
  ```plaintext
  VITE_API_URL=https://saverback.onrender.com
  VITE_WS_URL=wss://saverback.onrender.com
