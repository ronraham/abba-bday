/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: '#F5F3ED',
        'cream-dark': '#E8E5DC',
        vintage: {
          orange: '#FF6B35',
          yellow: '#F7B801',
          red: '#D32F2F',
        },
        dark: '#1A1A1A',
      },
      fontFamily: {
        sans: ['Inter', 'Heebo', 'system-ui', 'sans-serif'],
        display: ['Playfair Display', 'Georgia', 'serif'],
        hebrew: ['Heebo', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'vintage': '4px 4px 0px 0px rgba(0, 0, 0, 0.1)',
        'vintage-lg': '8px 8px 0px 0px rgba(0, 0, 0, 0.1)',
      },
    },
  },
  plugins: [],
}
