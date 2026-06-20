/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        darkBg: '#0f0f14',
        sidebarBg: '#16161f',
        cardBg: '#1e1e2e',
        primaryAccent: '#6366f1',
        successGreen: '#22c55e',
        warningAmber: '#f59e0b',
        textPrimary: '#e2e8f0',
        textMuted: '#64748b',
      },
    },
  },
  plugins: [],
}
