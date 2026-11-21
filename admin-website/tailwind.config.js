/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        admin: {
          sidebar: '#14142B',
          sidebarHover: '#1E1E38',
          sidebarBorder: '#23233E',
          activeBlue: '#4F46E5',
          activeBg: '#4F46E5',
          bodyBg: '#F4F6FC',
          cardBg: '#FFFFFF',
        },
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'card-soft': '0 4px 20px -2px rgba(50, 50, 93, 0.05), 0 2px 6px -1px rgba(0, 0, 0, 0.04)',
      },
    },
  },
  plugins: [],
};
