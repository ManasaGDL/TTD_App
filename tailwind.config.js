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
  plugins: [
    // Other plugins...
    function ({ addUtilities }) {
      const newUtilities = {
        '.disable-spinner::-webkit-outer-spin-button': {
          '-webkit-appearance': 'none',
          margin: '0',
        },
        '.disable-spinner::-webkit-inner-spin-button': {
          '-webkit-appearance': 'none',
          margin: '0',
        },
        '.disable-spinner': {
          '-moz-appearance': 'textfield',
        },
      };
      addUtilities(newUtilities, ['responsive', 'hover']);
    },
  ],
}