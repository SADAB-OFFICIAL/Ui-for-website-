import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}", // 👈 Ye line check karo, ye honi chahiye
  ],
  theme: {
    extend: {
      colors: {
        netflixRed: '#E50914',
      },
    },
  },
  plugins: [],
};
export default config;
