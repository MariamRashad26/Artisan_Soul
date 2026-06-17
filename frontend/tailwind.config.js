export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#bd580f',
        dark: '#221810',
      },
      fontFamily: {
        serif: ['Inter', 'sans-serif'],
        display: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
};
