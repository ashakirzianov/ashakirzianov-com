/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    fontFamily: {
      pixel: ['var(--font-pixel)', 'serif'],
    },
    extend: {
      aspectRatio: {
        'poster': '3/4',
      },
      spacing: {
        's': 'var(--padding)',
        'stn': 'var(--padding)',
        'l': 'calc(4 * var(--padding))',
        'card': 'var(--card)',
        'card-height': 'var(--card-text-height)',
        'collection': 'var(--collection)',
      },
      colors: {
        'paper': 'var(--paper)',
        'paper-light': 'var(--paper-light)',
        'fg': 'var(--foreground)',
        'fgl': 'var(--foreground-light)',
      }
    },
  },
  plugins: [],
}