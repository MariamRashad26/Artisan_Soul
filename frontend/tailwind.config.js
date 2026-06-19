import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    path.resolve(__dirname, "./index.html").replace(/\\/g, '/'),
    path.resolve(__dirname, "./src/**/*.{js,ts,jsx,tsx}").replace(/\\/g, '/'),
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
      },
    },
  },
  plugins: [],
};
