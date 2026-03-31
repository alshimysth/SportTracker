/** @type {import('tailwindcss').Config} */
module.exports = {
  // NativeWind v4 uses 'media' by default (follows system preference)
  darkMode: 'media',
  content: [
    './src/app/**/*.{js,jsx,ts,tsx}',
    './src/components/**/*.{js,jsx,ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      // ─── Alpine Pure (Light) & Midnight Peak (Dark) Dual-Theme Tokens ──────
      colors: {
        // Base backgrounds
        background: {
          DEFAULT: '#FFFFFF', // Alpine Pure light background
          dark: '#0F172A',    // Midnight Peak dark background
        },
        // Card / surface backgrounds
        surface: {
          DEFAULT: '#F8F9FA', // Light card surface
          dark: '#1E293B',    // Dark card surface
        },
        // Header / brand colour
        header: {
          DEFAULT: '#1C3F60', // Alpine blue header (light mode)
        },
        // Primary accent — Coral (call-to-action, active recording)
        primary: {
          DEFAULT: '#FF6B4A',
          light: '#FF8A70',
          dark: '#E55A39',
        },
        // Success accent — Summit Green (completion, PRs)
        success: {
          DEFAULT: '#22C55E',
          light: '#4ADE80',
          dark: '#16A34A',
        },
        // Data emphasis — Light Blue (light) / Dark Cyan (dark)
        data: {
          DEFAULT: '#0369A1', // Light Blue (light mode data emphasis)
          dark: '#38BDF8',    // Dark Cyan (dark mode data emphasis)
        },
      },
      // ─── Typography ──────────────────────────────────────────────────────────
      fontFamily: {
        // Inter for all UI/Feed text
        sans: ['Inter_400Regular', 'system-ui', 'sans-serif'],
        // Tabular numerals for timers and metrics (prevents horizontal jitter)
        mono: ['Inter_Mono', 'ui-monospace', 'monospace'],
      },
    },
  },
  plugins: [],
};
