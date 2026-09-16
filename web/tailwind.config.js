/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      './pages/**/*.{js,ts,jsx,tsx,mdx}',
      './components/**/*.{js,ts,jsx,tsx,mdx}',
      './app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
      extend: {
        fontFamily: {
          sans: ['Inter', 'sans-serif'],
          mono: ['Space Mono', 'monospace'],
        },
        animation: {
          'blink': 'blink 1.2s infinite',
          'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        },
        backgroundImage: {
          'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
          'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        },
        colors: {
          // Custom shades for better visual design
          'blue': {
            400: '#60a5fa',
            500: '#3b82f6',
            600: '#2563eb',
          },
          'purple': {
            400: '#c084fc',
            500: '#a855f7',
            600: '#9333ea',
          },
        },
      },
    },
    // Enable dynamic class name generation for color utilities
    safelist: [
      'bg-blue-500',
      'bg-blue-600',
      'bg-purple-500',
      'bg-purple-600',
      'text-blue-400',
      'text-purple-400',
      'hover:bg-blue-500',
      'hover:bg-purple-500',
      'border-blue-500',
      'border-purple-500',
    ],
    plugins: [],
  }