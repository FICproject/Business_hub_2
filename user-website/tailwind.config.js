/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          900: '#0B132B',
          800: '#0F172A',
          700: '#1C2541',
          600: '#2A365B',
        },
        teal: {
          500: '#0D9488',
          600: '#0F766E',
          400: '#14B8A6',
          300: '#2DD4BF',
        },
        softblue: {
          50: '#F0F7FF',
          100: '#E0EFFF',
          400: '#38BDF8',
          500: '#0EA5E9',
          600: '#0284C7',
        },
      },
    },
  },
  plugins: [],
};
