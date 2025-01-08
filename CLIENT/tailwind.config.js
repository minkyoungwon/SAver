/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      spacing: {
        "b-mg": "150px",
      },
      screens: {
        xs: "376px",
        sm: "640px",
        md: "768px", //bp
        lg: "1024px",
        xl: "1280px",
      },
    },
  },
  plugins: [],
};

//root-font-size : 16px (=1rem)
//   0.25 * 16px = 4px
//   0.5 * 16px = 8px
//   1 * 16px = 16px
//   2 * 16px = 32px
