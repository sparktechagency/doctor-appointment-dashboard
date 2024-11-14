/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#77C4FE",
        secondary: "#4A80D3",
        primaryBg: "#EBF6FE",
        hoverText: "#dcbb87",
      },
    },
  },
  plugins: [],
};
