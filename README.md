# 🚧 Saver 프로젝트 ~~(임시 배포 중지 상태)~~
~~⚠️ 현재 정지 상태입니다. (무료티어의 경우 7일동안 사용이 없으면 정지 상태로 인하여 임시적 정지 상태)~~

# 📑 Notion 프로젝트 정리
## https://determined-primula-ac4.notion.site/Saver-1a0eae425a698102a33adfe690075fe0?pvs=4 👈 클릭시 정리된 노션으로 이동 ()

# 🌐 배포된 홈페이지 
## [Saver 홈페이지](https://ssavert1.vercel.app/) 👈 클릭시 배포 사이트 이동 ()
### (프리티어 서버여서 처음 접속시 404 에러 혹은 에러 발생시가능 로그인하시고 게시판 사용 요망 혹은 새로고침 후에 기다리셨다가 사용해주세요)


<br />
<br />
<br />
<br />
<br />
<br />


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
