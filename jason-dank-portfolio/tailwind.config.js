/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        'heading': ['var(--font-outfit)', 'system-ui', 'sans-serif'],
        'body': ['var(--font-inter)', 'system-ui', 'sans-serif'],
        'mono': ['var(--font-jetbrains-mono)', 'Courier New', 'monospace'],
      },
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        accent: 'var(--accent)',
        'accent-muted': 'var(--accent-muted)',
      },
    },
  },
  plugins: [],
}