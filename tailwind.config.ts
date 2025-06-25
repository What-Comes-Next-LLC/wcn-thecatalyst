// tailwind.config.ts - Neobrutalist Coaching Design System
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
      // Clean color system - high contrast with strategic WCN accents
      colors: {
        // Primary palette - blacks, whites, grays
        slate: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
        },
        // WCN accent colors - strategic highlights only
        wcn: {
          primary: "#216869",   // Deep green - CTA buttons, active states
          accent1: "#49a078",   // Mid green - success, highlights  
          accent2: "#9cc5a1",   // Light green - subtle accents
          text: "#dce1de",      // Light text for dark backgrounds
          dark: "#000000",      // Black for dark backgrounds
          mid: "#49a078",       // Mid green alias
          light: "#9cc5a1",     // Light green alias
          gray: "#dce1de",      // Gray alias
          black: "#000000",     // Black alias
        },
      },
      
      // Background gradients
      backgroundImage: {
        'wcn-gradient': 'linear-gradient(to bottom, var(--tw-gradient-stops))',
      },
      
      // Background colors for cards
      backgroundColor: {
        'wcn-card': 'rgba(255, 255, 255, 0.1)',
      },
      
      // Border colors for cards
      borderColor: {
        'wcn-card': 'rgba(220, 225, 222, 0.2)',
        'wcn-card-hover': 'rgba(220, 225, 222, 0.4)',
      },
      
      // System typography - no external font dependencies
      fontFamily: {
        'sans': ['system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        'mono': ['ui-monospace', 'SFMono-Regular', 'Monaco', 'Consolas', 'monospace'],
      },
      
      // Semantic spacing - 4px base grid
      spacing: {
        '18': '4.5rem',   // 72px
        '72': '18rem',    // 288px
        '84': '21rem',    // 336px
        '96': '24rem',    // 384px
      },
      
      // Clean shadow system
      boxShadow: {
        'card': '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
        'card-hover': '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
        'button': '0 1px 2px 0 rgb(0 0 0 / 0.05)',
        'button-hover': '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
        'input-focus': '0 0 0 3px rgb(33 104 105 / 0.1)',
        '3xl': '0 35px 60px -12px rgba(0, 0, 0, 0.25)',
      },
      
      // Minimal border radius scale
      borderRadius: {
        'card': '0.75rem',   // 12px
        'button': '0.5rem',  // 8px
        'input': '0.375rem', // 6px
      },
      
      // Purposeful transitions
      transitionDuration: {
        '200': '200ms',
        '300': '300ms',
      },
      
      // Clean animation system
      animation: {
        'fade-in': 'fadeIn 0.2s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
      },
      
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [
    typography,
    // Custom component utilities
    function({ addComponents }: { addComponents: any }) {
      addComponents({
        // Card components
        '.card': {
          '@apply bg-white border border-slate-200 rounded-card shadow-card': {},
        },
        '.card-elevated': {
          '@apply bg-white border border-slate-200 rounded-card shadow-card-hover': {},
        },
        '.card-interactive': {
          '@apply bg-white border border-slate-200 rounded-card shadow-card hover:shadow-card-hover transition-shadow duration-200 cursor-pointer': {},
        },
        
        // Button components
        '.btn': {
          '@apply inline-flex items-center px-4 py-2 rounded-button font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2': {},
        },
        '.btn-primary': {
          '@apply btn bg-wcn-primary text-white hover:bg-wcn-accent1 focus:ring-wcn-primary shadow-button hover:shadow-button-hover': {},
        },
        '.btn-secondary': {
          '@apply btn bg-slate-100 text-slate-800 hover:bg-slate-200 focus:ring-slate-500 shadow-button hover:shadow-button-hover': {},
        },
        '.btn-ghost': {
          '@apply btn text-wcn-primary hover:bg-slate-50 focus:ring-wcn-primary': {},
        },
        
        // Button size variants
        '.btn-sm': {
          '@apply px-3 py-1.5 text-sm': {},
        },
        '.btn-lg': {
          '@apply px-6 py-3 text-lg': {},
        },
        '.btn-xl': {
          '@apply px-8 py-4 text-xl': {},
        },
        
        // Input components
        '.input': {
          '@apply block w-full px-3 py-2 border border-slate-300 rounded-input shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-wcn-primary focus:border-wcn-primary transition-colors duration-200': {},
        },
        '.input-error': {
          '@apply input border-red-300 focus:ring-red-500 focus:border-red-500': {},
        },
        
        // Layout helpers
        '.container-narrow': {
          '@apply max-w-2xl mx-auto px-4': {},
        },
        '.container-wide': {
          '@apply max-w-6xl mx-auto px-4': {},
        },
        
        // Text utilities
        '.text-heading': {
          '@apply font-semibold text-slate-900': {},
        },
        '.text-body': {
          '@apply text-slate-700': {},
        },
        '.text-muted': {
          '@apply text-slate-500': {},
        },
      });
    },
  ],
};

export default config;