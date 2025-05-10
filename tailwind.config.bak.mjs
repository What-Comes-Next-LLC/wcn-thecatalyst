// tailwind.config.mjs
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
          dark: '#216869',
          mid: '#49a078',
          light: '#9cc5a1',
          gray: '#dce1de',
          black: '#000000',
        },
      },
    },
  },
  plugins: [],
};