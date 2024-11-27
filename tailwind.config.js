/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#D5EDFF",
        secondary: "#0f5fe3",
        primaryBg: "#EBF6FE",
        hoverText: "#dcbb87",
      },
    },
  },
  plugins: [],
};
