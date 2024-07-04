/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors:{
        'custom-header-bg':"#4CAF50",
        'custom-header-text': '#FFFFFF'
      }
    },
  },
  plugins: [],
}