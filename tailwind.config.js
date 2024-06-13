/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "gray-main": "#333",
        "gray-light": "#444",
        "gray-dark": "#222",
        "spoti": "#1ed760"
      }
    },
  },
  plugins: [],
}

