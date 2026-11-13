/** @type {import('tailwindcss').Config} */
const config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        rose: {
          50: 'rgb(var(--color-rose-50) / <alpha-value>)',
          100: 'rgb(var(--color-rose-100) / <alpha-value>)',
          200: 'rgb(var(--color-rose-200) / <alpha-value>)',
          300: 'rgb(var(--color-rose-300) / <alpha-value>)',
          400: 'rgb(var(--color-rose-400) / <alpha-value>)',
          500: 'rgb(var(--color-rose-500) / <alpha-value>)',
          600: 'rgb(var(--color-rose-600) / <alpha-value>)',
          700: 'rgb(var(--color-rose-700) / <alpha-value>)',
        },
        coral: {
          50: 'rgb(var(--color-coral-50) / <alpha-value>)',
          100: 'rgb(var(--color-coral-100) / <alpha-value>)',
          200: 'rgb(var(--color-coral-200) / <alpha-value>)',
          300: 'rgb(var(--color-coral-300) / <alpha-value>)',
          400: 'rgb(var(--color-coral-400) / <alpha-value>)',
          500: 'rgb(var(--color-coral-500) / <alpha-value>)',
          600: 'rgb(var(--color-coral-600) / <alpha-value>)',
        },
        ink: 'rgb(var(--color-ink) / <alpha-value>)',
        surface: 'rgb(var(--color-surface) / <alpha-value>)',
      },
      fontFamily: {
        display: ['Manrope', 'system-ui', '-apple-system', 'sans-serif'],
        game: ['Rajdhani', 'Manrope', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      boxShadow: {
        soft: '0 10px 40px -12px rgba(37, 115, 74, 0.2)',
        'soft-lg': '0 24px 60px -16px rgba(37, 115, 74, 0.28)',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'scale-in': {
          '0%': { opacity: '0', transform: 'scale(0.96)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        'slide-up': {
          '0%': { opacity: '0', transform: 'translateY(100%)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-in-left': {
          '0%': { opacity: '0', transform: 'translateX(-100%)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        'slide-in-right': {
          '0%': { opacity: '0', transform: 'translateX(100%)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.3s ease-out',
        'scale-in': 'scale-in 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
        'slide-up': 'slide-up 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        'slide-in-left': 'slide-in-left 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        'slide-in-right': 'slide-in-right 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
      },
    },
  },
  plugins: [],
};

export default config;
