/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class', // 👈 manually controlled dark mode
  theme: {
    extend: {
      colors: {
        brand: {
          light: '#60a5fa',     // blue-400
          DEFAULT: '#3b82f6',   // blue-500
          dark: '#2563eb',      // blue-600
        },
      },
    },
  },
  plugins: [],
};