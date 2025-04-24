import type { Config } from 'tailwindcss';

export default {
  darkMode: ['class'],
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  plugins: [require('tailwindcss-animate'), require('daisyui')],
  daisyui: {
    themes: true, // Enable all themes
    darkTheme: 'dark', // Set the default dark theme
    base: true, // Apply base styles
    styled: true, // Apply DaisyUI's styled components
    utils: true, // Enable utility classes
    prefix: '', // Prefix for DaisyUI classes
    logs: false, // Disable logs
  },
} satisfies Config;
