import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    path.join(__dirname, 'index.html'),
    path.join(__dirname, 'src/**/*.{js,ts,jsx,tsx}'),
  ],
  theme: {
    extend: {
      colors: {
        ivory: {
          DEFAULT: '#FAF6F0',
          warm: '#F3ECE2',
          stone: '#E8DFD1',
          border: '#DED3C3',
        },
        oxblood: {
          DEFAULT: '#2D1018',
          deep: '#1E0A10',
          plum: '#471B27',
          soft: '#662A3B',
        },
        ink: {
          DEFAULT: '#1C1517',
          muted: '#574A4D',
          subtle: '#75666A',
        },
        brass: {
          DEFAULT: '#9A7432',
          dark: '#7A5820',
          light: '#E2C285',
          champagne: '#F4E6C8',
        },
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', '"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"DM Sans"', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      maxWidth: {
        editorial: '1380px',
      },
    },
  },
  plugins: [],
};
