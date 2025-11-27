/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./App.{js,jsx,ts,tsx}', './src/**/*.{js,jsx,ts,tsx}', './index.ts'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        // Primary green shades
        primary: {
          DEFAULT: '#2ECC71',
          dark: '#27AE60',
          light: '#58D68D',
        },
        // Dark green/teal for headings
        heading: {
          DEFAULT: '#1B4332',
          light: '#2D6A4F',
        },
        // Background colors
        background: {
          DEFAULT: '#FFFFFF',
          secondary: '#F5F5F5',
          card: '#F0F4F3',
          mint: '#E8F5E9',
        },
        // Text colors
        text: {
          DEFAULT: '#1B4332',
          secondary: '#9E9E9E',
          light: '#B0B0B0',
        },
        // Accent colors
        accent: {
          red: '#EF5350',
          orange: '#FF6B6B',
        },
        // Dark mode colors
        dark: {
          background: '#121212',
          surface: '#1E1E1E',
          card: '#2C2C2C',
          text: '#FFFFFF',
          textSecondary: '#B0B0B0',
        },
      },
      fontFamily: {
        poppins: ['Poppins_400Regular'],
        'poppins-medium': ['Poppins_500Medium'],
        'poppins-semibold': ['Poppins_600SemiBold'],
        'poppins-bold': ['Poppins_700Bold'],
        inter: ['Inter_400Regular'],
        'inter-medium': ['Inter_500Medium'],
        'inter-semibold': ['Inter_600SemiBold'],
      },
      borderRadius: {
        xl: '16px',
        '2xl': '24px',
        '3xl': '32px',
      },
      boxShadow: {
        card: '0 2px 8px rgba(0, 0, 0, 0.08)',
        'card-lg': '0 4px 12px rgba(0, 0, 0, 0.1)',
      },
    },
  },
  plugins: [],
};
