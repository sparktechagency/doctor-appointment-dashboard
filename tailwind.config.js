/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#0d28e0",
        secondary: "#3780f9",
        primaryBg: "#EBF6FE",
        hoverText: "#dcbb87",
      },
    },
  },
  plugins: [],
};
