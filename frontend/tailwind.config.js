/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#ff0000",
        background: "#0f0f0f",
        surface: "#272727",
        surfaceHover: "#3f3f3f",
      }
    },
  },
  plugins: [],
}
