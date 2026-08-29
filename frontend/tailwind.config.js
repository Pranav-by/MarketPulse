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
        serif: ['Newsreader', 'serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        canvas: '#090a0f',
        surface: '#10121a',
        elevated: '#161924',
        muted: '#1c2030',
      },
      backdropBlur: {
        xs: '2px',
      },
      scale: {
        '102': '1.02',
      },
    },
  },
  plugins: [],
}
