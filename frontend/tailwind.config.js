/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        background: '#0B1120',
        surface: 'rgba(20,28,48,0.6)',
        'accent-start': '#3B82F6',
        'accent-end': '#60A5FA',
        highlight: '#818CF8',
        'text-primary': '#E2E8F0',
        'text-muted': '#94A3B8',
        border: 'rgba(255,255,255,0.08)',
      },
      fontFamily: {
        'space-grotesk': ['"Space Grotesk"', 'ui-sans-serif', 'system-ui'],
      },
      backdropBlur: {
        xl: '20px',
        md: '8px',
      },
    },
  },
  plugins: [],
};
