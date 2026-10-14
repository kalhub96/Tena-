/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        teal: {
          50: "#e6f7f5",
          100: "#b3e8e3",
          200: "#7dd3ca",
          300: "#4dbfb5",
          400: "#2ba898",
          500: "#1e8f83",
          600: "#1e7a6e",
          700: "#176057",
          800: "#0f4c45",
          900: "#0a3d37",
        },
      },
    },
  },
  plugins: [],
};
