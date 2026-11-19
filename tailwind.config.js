/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // "navy" is the app-wide ink/neutral ramp, remapped to a green-charcoal
        // scale: Forest Ink #173C35 for headings/primary, Slate Sage #52645D
        // for secondary text, Soft Stone #E8E2D7 for borders.
        navy: {
          50: '#F7F5EF',
          100: '#E8E2D7',
          200: '#DDD5C6',
          300: '#B9B1A1',
          400: '#8A928B',
          500: '#52645D',
          600: '#41524B',
          700: '#2E4A41',
          800: '#1F443C',
          900: '#173C35',
          950: '#0F2A24',
        },
        // "accent" is Muted Copper, used sparingly for decorative highlights.
        accent: {
          50: '#FBF3EC',
          100: '#F6E4D5',
          200: '#EFD0B6',
          300: '#E5B287',
          400: '#DE9F6E',
          500: '#D98C5F',
          600: '#C27448',
          700: '#A05C36',
        },
      },
      fontFamily: {
        heading: ['Manrope', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        body: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 2px rgba(23, 60, 53, 0.05), 0 8px 24px -12px rgba(23, 60, 53, 0.10)',
        lift: '0 2px 4px rgba(23, 60, 53, 0.06), 0 18px 44px -16px rgba(23, 60, 53, 0.18)',
      },
    },
  },
  plugins: [],
};
