/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      screens:{
        'smd': '830px',
      },
      colors: {
        main: '#111827',
        secondary: '#111827',
        'dark-200': '#A4B0C8',
        'dark-300': '#181F2F',
        'dark-400': '#2A3755',
        'dark-500': '#3B4457',
        'blue-custom': '#2A39FF',
        'purple-custom': '#5B1B8C',
        'text-main': '#ffffff',
        'text-secondary': '#ffffff ',
      },
      animation: {
        'background-position-spin': 'background-position-spin 3000ms infinite alternate',
        'fade-in': 'fadeIn 2s ease-out',
      },
      keyframes: {
        'background-position-spin': {
          '0%': { backgroundPosition: 'top center' },
          '100%': { backgroundPosition: 'bottom center' },
        },
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};
