/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Space Grotesk', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        'brutal-yellow': '#FEF08A',
        'brutal-pink': '#FF6B97',
        'brutal-mint': '#6EE7B7',
        'brutal-cyan': '#67E8F9',
        'brutal-lavender': '#C4B5FD',
        'brutal-coral': '#FDA4AF',
        'brutal-blue': '#5B85FA',
        'brutal-cream': '#FEFDF8',
        'brutal-bg': '#5B85FA',
      },
      boxShadow: {
        'brutal-sm': '2px 2px 0px 0px #000000',
        'brutal': '4px 4px 0px 0px #000000',
        'brutal-lg': '6px 6px 0px 0px #000000',
        'brutal-xl': '8px 8px 0px 0px #000000',
      },
      borderWidth: {
        '3': '3px',
      },
    },
  },
  plugins: [],
}
