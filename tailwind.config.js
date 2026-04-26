/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,ts}"],
  theme: {
    extend: {
      colors: {
        'ds': {
          'bg':      '#0d0f18',
          'raised':  '#111421',
          'surface': '#161b2e',
          'overlay': '#1c2340',
          'nav':     '#0f1628',
          'gold':    '#e8a020',
          'gold-h':  '#c8810a',
          'orange':  '#d4621a',
          'pink':    '#e8608a',
          'sky':     '#7ab4e0',
          'sky-h':   '#a8d4f0',
          'otsp':    '#4a90c4',
          'text':    '#f0ece4',
          'text-2':  '#9ea3b0',
          'text-3':  '#5c6070',
        },
      },
      fontFamily: {
        display: ['Lusitana', 'Georgia', 'serif'],
        body:    ['Raleway', 'system-ui', 'sans-serif'],
        mono:    ['"Space Mono"', '"Courier New"', 'monospace'],
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
