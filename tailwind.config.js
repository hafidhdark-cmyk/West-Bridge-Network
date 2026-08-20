/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        wbn: {
          navy: '#0F172A',
          blue: '#1E3A8A',
          cobalt: '#2563EB',
          slate: '#64748B',
          grayLight: '#F1F5F9',
          bg: '#F8FAFC',
          red: '#DC2626',
        },
      },
    },
  },
  plugins: [],
}
