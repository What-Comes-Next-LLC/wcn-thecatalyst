export default {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        wcn: {
          primary: '#216869',
          text: '#dce1de',
          accent1: '#49a078',
          accent2: '#9cc5a1',
          dark: '#000000',
          mid: '#49a078',
          light: '#9cc5a1',
          gray: '#dce1de',
          black: '#000000',
        },
      },
      backgroundImage: {
        'wcn-gradient': 'linear-gradient(to bottom, var(--tw-gradient-stops))',
      },
      backgroundColor: {
        'wcn-card': 'rgba(255, 255, 255, 0.1)',
      },
      backdropBlur: {
        'wcn-card': '8px',
      },
      borderColor: {
        'wcn-card': 'rgba(220, 225, 222, 0.2)',
        'wcn-card-hover': 'rgba(220, 225, 222, 0.4)',
      },
      animation: {
        'shimmer': 'shimmer 2s infinite linear',
        'pulse-subtle': 'pulse-subtle 3s infinite ease-in-out',
      },
      keyframes: {
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        'pulse-subtle': {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.02)' },
        },
      },
      scale: {
        '102': '1.02',
      },
    },
  },
  plugins: [],
}; 