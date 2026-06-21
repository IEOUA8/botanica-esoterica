/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        forest: '#063D2E',
        deep: '#0B2F24',
        ritual: '#F4EFE3',
        gold: '#C8A24A',
        terracotta: '#B84812',
        incense: '#5B3521',
        warm: '#FFFDF7',
      },
      fontFamily: {
        display: ['Cormorant Garamond', 'Georgia', 'serif'],
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 18px 45px rgba(6, 61, 46, 0.12)',
        card: '0 4px 20px rgba(6, 61, 46, 0.06)',
        'card-hover': '0 12px 36px rgba(6, 61, 46, 0.16)',
      },
    },
  },
  plugins: [],
}
