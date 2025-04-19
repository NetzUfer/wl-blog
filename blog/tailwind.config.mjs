/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        primary: '#f8b0c2', // Rosa
        secondary: '#f5e6d8', // Beige
        accent: '#ff7bac', // Dunkleres Rosa für Akzente
        dark: '#333333',
        light: '#ffffff'
      },
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
        serif: ['Playfair Display', 'serif']
      }
    },
  },
  plugins: [],
};