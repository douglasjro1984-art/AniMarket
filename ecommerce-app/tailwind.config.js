/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Paleta de marca "Nexo" — evita los defaults típicos de IA
        ink: '#161A30',        // texto principal / headers oscuros
        brand: {
          DEFAULT: '#D946A8',  // fucsia — navbar, footer
          light: '#E879C8',
          dark: '#B83090',
        },
        accent: {
          DEFAULT: '#FF5A36',  // naranja vívido — CTAs ("Agregar al carrito")
          dark: '#E14522',
        },
        mint: {
          DEFAULT: '#17A673',  // verde esmeralda — stock, confirmaciones
          light: '#E4F7EF',
        },
        gold: '#FFC93C',       // detalles/badges puntuales
        canvas: '#F3F4F8',     // fondo general frío
      },
      fontFamily: {
        display: ['"Sora"', 'sans-serif'],
        body: ['"Inter"', 'sans-serif'],
      },
      boxShadow: {
        card: '0 2px 10px rgba(22, 26, 48, 0.06)',
        cardHover: '0 12px 24px rgba(22, 26, 48, 0.12)',
      },
    },
  },
  plugins: [],
}
