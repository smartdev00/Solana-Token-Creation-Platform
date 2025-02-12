/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        main: '#111827',
        secondary: '#c0a3ff',
        'dark-200': '#A4B0C8',
        'dark-300': '#181F2F',
        'dark-400': '#2A3755',
        'dark-500': '#3B4457',
        'blue-custom': '#2A39FF',
        'purple-custom': '#5B1B8C',
      },
      animation: {
        'background-position-spin': 'background-position-spin 3000ms infinite alternate',
      },
      keyframes: {
        'background-position-spin': {
          '0%': { backgroundPosition: 'top center' },
          '100%': { backgroundPosition: 'bottom center' },
        },
      },
    },
  },
  plugins: [],
};
