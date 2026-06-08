
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        pixel: ['"Press Start 2P"', 'monospace'],
      },
      colors: {
        gb: {
          light: '#e0f8d0',
          midlight: '#88c070',
          middark: '#346856',
          dark: '#081820'
        }
      }
    },
  },
  plugins: [],
}
