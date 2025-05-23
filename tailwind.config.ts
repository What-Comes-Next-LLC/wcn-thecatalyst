// tailwind.config.ts
import type { Config } from "tailwindcss";
import typography from "@tailwindcss/typography";

const config: Config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        wcn: {
          primary: "#216869",   // Deep green - core logo color
          text: "#dce1de",      // Soft gray - logo text and light contrast
          accent1: "#49a078",   // Mid green - vibrant highlight
          accent2: "#9cc5a1",   // Light green - soft callouts or backgrounds
          dark: "#000000",      // True black - accent, text emphasis
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
  plugins: [typography],
};

export default config;
