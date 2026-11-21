/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        gold: {
          50: '#FFFDF0',
          100: '#FEF8C6',
          200: '#FDE98A',
          300: '#FCD34D',
          400: '#FBBF24',
          500: '#F59E0B',
          600: '#D97706',
          700: '#B45309',
        },
        navy: {
          950: '#070C1B',
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
