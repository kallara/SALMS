/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gov: {
          navy: {
            DEFAULT: '#0a192f',
            light: '#172a45',
            dark: '#020c1b',
            accent: '#1e3a8a',
          },
          gold: {
            DEFAULT: '#d4af37',
            light: '#f3e5ab',
            dark: '#aa7c11',
            muted: '#c5a059',
          },
          slate: {
            50: '#f8fafc',
            100: '#f1f5f9',
            200: '#e2e8f0',
            300: '#cbd5e1',
            800: '#1e293b',
            900: '#0f172a',
          }
        },
        status: {
          P: '#10b981',      // Present (Emerald)
          LEAVE: '#f59e0b',  // Leave (Amber)
          OD: '#3b82f6',     // On Duty (Blue)
          TR: '#14b8a6',     // Tour (Teal)
          TO: '#06b6d4',     // Tour Off (Cyan)
          CO: '#8b5cf6',     // Compensatory Off (Violet)
          WO: '#6b7280',     // Weekly Off (Gray)
          H: '#6366f1',      // Holiday (Indigo)
          A: '#ef4444',      // Absent (Red)
          FH: '#f97316',     // First Half (Orange)
          SH: '#0ea5e9',     // Second Half (Sky)
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Outfit', 'sans-serif'],
      },
      boxShadow: {
        'premium': '0 4px 20px -2px rgba(10, 25, 47, 0.08), 0 2px 8px -1px rgba(10, 25, 47, 0.04)',
        'gold-glow': '0 0 15px -3px rgba(212, 175, 55, 0.3)',
      }
    },
  },
  plugins: [],
}
