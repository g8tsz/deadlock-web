import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        deadlock: {
          dark: "#1a120b",
          card: "#251a12",
          surface: "#2d2118",
          brown: "#3d2817",
          gold: "#c9a227",
          "gold-light": "#d4af37",
          "gold-dark": "#a67c00",
          muted: "#a09080",
          cream: "#f5f0e8",
        },
      },
    },
  },
  plugins: [],
};
export default config;
