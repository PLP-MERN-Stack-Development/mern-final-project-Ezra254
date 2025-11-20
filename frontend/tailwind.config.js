/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f1f7ff',
          100: '#dcecff',
          200: '#bcd9ff',
          300: '#8abfff',
          400: '#539eff',
          500: '#2a7ef4',
          600: '#1565d6',
          700: '#0f50a9',
          800: '#0f4589',
          900: '#102f5a',
        },
        success: '#2bc48a',
        warning: '#f4b740',
        danger: '#ff6b6b',
        slate: {
          950: '#0b1120',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 10px 30px -10px rgba(15, 80, 169, 0.2)',
      },
    },
  },
  plugins: [],
};

