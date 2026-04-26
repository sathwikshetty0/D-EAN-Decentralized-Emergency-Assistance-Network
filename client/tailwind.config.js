/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bgPrimary: 'var(--bg-primary)',
        bgSecondary: 'var(--bg-secondary)',
        bgTertiary: 'var(--bg-tertiary)',
        bgElevated: 'var(--bg-elevated)',
        redSos: 'var(--red-sos)',
        blueCloud: 'var(--blue-cloud)',
        orangeP2p: 'var(--orange-p2p)',
        greenSafe: 'var(--green-safe)',
        textPrimary: 'var(--text-primary)',
        textSecondary: 'var(--text-secondary)',
        textMuted: 'var(--text-muted)'
      },
      fontFamily: {
        syne: ['Syne', 'sans-serif'],
        sans: ['DM Sans', 'sans-serif']
      }
    },
  },
  plugins: [],
}
