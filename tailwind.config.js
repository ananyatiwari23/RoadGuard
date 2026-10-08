/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        obsidian: {
          DEFAULT: '#080808',
          light: '#f8fafc',
          panel: 'rgba(255, 255, 255, 0.02)',
          border: 'rgba(255, 255, 255, 0.08)',
          hover: 'rgba(255, 255, 255, 0.04)',
        },
        silver: {
          DEFAULT: '#E2E8F0',
          muted: '#94A3B8',
          subtle: 'rgba(255, 255, 255, 0.4)',
        },
        // Semantic color exceptions ONLY
        semantic: {
          low: '#30A46C',
          medium: '#F5A524',
          high: '#E5484D',
          emerald: '#30A46C',
          amber: '#F5A524',
          rose: '#E5484D',
          silver: '#94A3B8',
        },
      },
      fontFamily: {
        sans: ['Geist', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['Geist Mono', 'monospace'],
      },
      borderRadius: {
        'hero': '4rem',
        'hero-mobile': '2rem',
        'card': '1rem',
      },
      transitionTimingFunction: {
        'obsidian': 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
      transitionDuration: {
        'obsidian': '800ms',
        'status': '200ms',
      },
      boxShadow: {
        'btn-silver': '0 0 20px rgba(255, 255, 255, 0.15)',
      },
    },
  },
  plugins: [],
}
