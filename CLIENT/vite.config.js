import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/

// 문제가 생기시면 바꾸시면 되십니다 기존것으로 mkw
// 기존 쓰던 config.js
// export default defineConfig({
//   plugins: [react()],
// })

// 이전거는 지우지는 말아주세요~ mkw
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // ✅ IPv4 우선 사용 (기본적으로 ::1(IPv6)보다 IPv4를 우선 적용)
    proxy: {
      '/api': {
        target: 'http://localhost:5000', // 백엔드 서버 주소
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
