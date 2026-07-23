import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        // Warm, refined palette
        "party-bg": "#FFF9F5",
        "party-surface": "#FFFFFF",
        "party-border": "#F0E6DF",
        "party-text": "#2D2019",
        "party-muted": "#8A7B6F",
        "party-accent": "#D4956A",
        "party-accent-deep": "#B87340",
        "party-blush": "#F8E8DD",
        "party-gold": "#C9A96E",
        "party-gold-light": "#E5D4B0",
        "party-rose": "#E8A0B4",
        "party-rose-deep": "#D4728E",
      },
      fontFamily: {
        display: ["var(--font-playfair)", "serif"],
        script: ["var(--font-script)", "cursive"],
        body: ["var(--font-nunito)", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
