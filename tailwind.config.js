/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend:
   
     {

      // textDecoration: ['hover', 'focus'],
      colors:{
        'custom-header-bg':"#4CAF50",
        'custom-header-text': '#FFFFFF',
        'custom-color-danger':'#b91c1c',
      }
    },
  },
  variants:{
    extend: {
      textDecoration: ['hover', 'focus'],
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
        '.no-underline': {
          'text-decoration': 'none',
          'border-bottom': 'none',
        },
      };
      addUtilities(newUtilities, ['responsive', 'hover']);
    },
  ],
}