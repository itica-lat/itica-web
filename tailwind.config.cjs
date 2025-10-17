module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}'
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['MADE Outer Sans', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        'sans-alt': ['MADE Outer Sans Alt', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        outline: ['MADE Outer Sans Outline', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        'outline-alt': ['MADE Outer Sans Outline Alt', 'ui-sans-serif', 'system-ui', 'sans-serif']
      }
    }
  },
  plugins: []
}
