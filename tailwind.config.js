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
        'hero': ['var(--font-oswald)', 'Impact', 'sans-serif'], // Massive hero name - bold, condensed
        'display': ['var(--font-playfair)', 'Georgia', 'serif'], // Premium display font for section headlines
        'editorial': ['var(--font-crimson)', 'Georgia', 'serif'], // Editorial body text - elegant serif
        'heading': ['var(--font-space-grotesk)', 'system-ui', 'sans-serif'], // Modern headings - geometric
        'body': ['var(--font-inter)', 'system-ui', 'sans-serif'], // Clean body text
        'accent': ['var(--font-jetbrains-mono)', 'Courier New', 'monospace'], // Technical accent
        'mono': ['var(--font-jetbrains-mono)', 'Courier New', 'monospace'],
        'sans': ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'mega': ['clamp(6rem, 20vw, 20rem)', { lineHeight: '0.8', letterSpacing: '-0.05em' }], // Absolutely massive hero name
        'hero': ['clamp(4rem, 12vw, 12rem)', { lineHeight: '0.85', letterSpacing: '-0.03em' }], // Large hero text
        'display': ['clamp(3rem, 8vw, 8rem)', { lineHeight: '0.9', letterSpacing: '-0.02em' }], // Section headers
        'headline': ['clamp(2.5rem, 6vw, 6rem)', { lineHeight: '0.95', letterSpacing: '-0.02em' }], // Project titles
        'subhead': ['clamp(1.5rem, 3vw, 3rem)', { lineHeight: '1.1', letterSpacing: '-0.01em' }], // Subtitles
        'editorial': ['clamp(1.25rem, 2.5vw, 2rem)', { lineHeight: '1.3', letterSpacing: '0' }], // Editorial body
        'large': ['clamp(1.125rem, 2vw, 1.5rem)', { lineHeight: '1.4', letterSpacing: '0' }], // Large body text
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '26': '6.5rem',
        '30': '7.5rem',
        '34': '8.5rem',
        '38': '9.5rem',
      },
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        accent: 'var(--accent)',
        'accent-muted': 'var(--accent-muted)',
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.6s ease-out forwards',
        'fade-in': 'fadeIn 0.6s ease-out forwards',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        }
      },
    },
  },
  plugins: [],
}