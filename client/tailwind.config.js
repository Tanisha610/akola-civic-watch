/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        civic: {
          50: '#fefefe',
          100: '#edecec',
          200: '#e0e7d7',
          300: '#cfd8c1',
          400: '#b7c396',
          500: '#9cab78',
          600: '#7f8f63',
          700: '#646d52',
          800: '#4f5543',
          900: '#34382f'
        },
        civicOrange: '#ba9a91',
        civicRose: '#e0e7d7',
        civicStone: '#cccccc'
      },
      boxShadow: {
        soft: '0 20px 50px rgba(15, 23, 42, 0.12)'
      },
      backgroundImage: {
        'civic-grid': 'radial-gradient(circle at 1px 1px, rgba(183, 195, 150, 0.18) 1px, transparent 0)'
      }
    }
  },
  plugins: []
};
