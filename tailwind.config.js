module.exports = {
  purge: {
    content: [
      './src/**/*.html',
      './src/**/*.js',
      './src/**/*.ts',
    ],
    safelist: []
  },
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
      }
    },
  },
  variants: {
    extend: {
      opacity: ['disabled'],
      cursor: ['disabled'],
    }
  },
  plugins: [],
}
