/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'deep-black': '#0a0a0a',
        'charcoal': '#1a1a1a',
        'neon-purple': '#b026ff',
        'electric-blue': '#00e5ff',
        'neon-red': '#ff2a2a',
        'oracle-gold': '#FFD700',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        heading: ['Outfit', 'sans-serif'],
      },
      scale: {
        '103': '1.03',
      },
      animation: {
        'pulse-slow': 'pulse-border 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        'pulse-border': {
          '0%, 100%': { opacity: 0.4 },
          '50%': { opacity: 1 },
        }
      }
    },
  },
  plugins: [],
}
