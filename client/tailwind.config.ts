import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'primary-gray': '#24272d',
        'secondary-gray': '#2f333a',
        'primary-white': '#d0d9e4',
      },
    },
  },
  plugins: [],
};
export default config;
