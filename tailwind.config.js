/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: 'rgb(var(--background) / <alpha-value>)',
        foreground: 'rgb(var(--foreground) / <alpha-value>)',
        muted: 'rgb(var(--muted) / <alpha-value>)',
        'muted-foreground': 'rgb(var(--muted-foreground) / <alpha-value>)',
        border: 'rgb(var(--border) / <alpha-value>)',
        primary: 'rgb(var(--primary) / <alpha-value>)',
        'primary-foreground': 'rgb(var(--primary-foreground) / <alpha-value>)',
        secondary: 'rgb(var(--secondary) / <alpha-value>)',
        'secondary-foreground': 'rgb(var(--secondary-foreground) / <alpha-value>)',
        accent: 'rgb(var(--accent) / <alpha-value>)',
        'accent-foreground': 'rgb(var(--accent-foreground) / <alpha-value>)',
        success: 'rgb(var(--success) / <alpha-value>)',
        warning: 'rgb(var(--warning) / <alpha-value>)',
        error: 'rgb(var(--error) / <alpha-value>)',
        // Monochrome design system - sophisticated and minimalist
        mono: {
          background: '#121212',      // Material Design dark
          surface: '#1E1E1E',         // Cards/surfaces  
          text: '#E0E0E0',            // Off-white for reduced eye strain
          border: '#333333',          // Subtle borders
          muted: '#2A2A2A',           // Muted surfaces
          'text-secondary': '#F0F0F0' // Secondary text - improved contrast
        }
      },
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'sans-serif'],
        'serif': ['Lora', 'Georgia', 'serif']
      },
      borderRadius: {
        'bubble': '2.5rem'
      }
    },
  },
  plugins: [],
}
