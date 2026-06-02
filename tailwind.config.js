/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        glaze: {
          50: "#f0f4ff",
          100: "#e0eaff",
          200: "#c7d7fe",
          300: "#a5bcfc",
          400: "#8196f8",
          500: "#6272f3",
          600: "#4f57e8",
          700: "#4045cf",
          800: "#363aa7",
          900: "#303584",
          950: "#1e2052",
        },
        surface: {
          0: "#0e0e12",
          1: "#14141a",
          2: "#1c1c24",
          3: "#23232e",
          4: "#2b2b38",
          5: "#343444",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "Fira Code", "Consolas", "monospace"],
      },
    },
  },
  plugins: [],
};
