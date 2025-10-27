import type { Config } from 'tailwindcss'

export default {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f5f7ff',
          100: '#e9efff',
          500: '#5b6ef5',
          600: '#4558e6',
          700: '#3245d1'
        }
      }
    }
  },
  plugins: []
} satisfies Config
