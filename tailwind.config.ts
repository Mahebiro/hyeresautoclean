import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./content/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          50: "#eef2f8",
          100: "#d7e0ee",
          200: "#aebfdd",
          300: "#869fcc",
          400: "#5d7ebb",
          500: "#3a5fa0",
          600: "#284a83",
          700: "#1c3866",
          800: "#122549",
          900: "#0a1730",
          950: "#050c1c",
        },
        sky: {
          50: "#eef7ff",
          100: "#d9edff",
          200: "#b3dbff",
          300: "#8cc8ff",
          400: "#5aabff",
          500: "#2f8dff",
        },
      },
      fontFamily: {
        sans: [
          "Inter",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Roboto",
          "Helvetica Neue",
          "Arial",
          "sans-serif",
        ],
        display: [
          "Outfit",
          "Inter",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
      },
      boxShadow: {
        premium: "0 20px 60px -15px rgba(10, 23, 48, 0.35)",
      },
    },
  },
  plugins: [],
};
export default config;
