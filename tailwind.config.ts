import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        "deeni-ink": "#3F0F2B",
        "deeni-pink-deep": "#C2185B",
        "deeni-pink-mid": "#E8628F",
        "deeni-pink-soft": "#F6A8C4",
        "deeni-blush": "#FDEEF3",
        "deeni-cream": "#FFF8F1",
        "deeni-gold": "#C9A227",
        "deeni-gold-light": "#E9CE7E",
      },
      fontFamily: {
        display: ["var(--font-playfair)", "serif"],
        script: ["var(--font-script)", "cursive"],
        body: ["var(--font-nunito)", "sans-serif"],
      },
      backgroundImage: {
        "royal-gradient":
          "radial-gradient(120% 120% at 50% 0%, #F6A8C4 0%, #E8628F 45%, #C2185B 100%)",
      },
      boxShadow: {
        stamp: "0 0 0 3px rgba(201,162,39,0.35)",
      },
    },
  },
  plugins: [],
};
export default config;
