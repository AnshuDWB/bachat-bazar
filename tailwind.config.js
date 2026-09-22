/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          red: '#D71920',
          redDark: '#B5141A',
          redLight: '#FFF1F1',
          redSoft: '#FEE2E2',
          black: '#111111',
          dark: '#1C1C1C',
          muted: '#666666',
          border: '#E5E5E5',
          bgLight: '#F7F7F7',
          card: '#FFFFFF',
        }
      },
      fontFamily: {
        sans: ['Poppins', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'subtle': '0 2px 8px rgba(0, 0, 0, 0.04)',
        'card': '0 4px 12px rgba(0, 0, 0, 0.05)',
        'red-glow': '0 4px 14px rgba(215, 25, 32, 0.25)',
      }
    },
  },
  plugins: [],
}
