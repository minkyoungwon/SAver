/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      screens: {
        xs: "376px", // 376px 기준 추가(사용은안함))
        sm: "640px",
        lg: "1024px",
        xl: "1280px",
      },
    },
  },
  plugins: [],
};
