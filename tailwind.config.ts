import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        petrol: {
          DEFAULT: "#0A0908",
          panel: "#17130F",
          line: "#2E2620",
        },
        brass: {
          DEFAULT: "#D99A3D",
          light: "#EDB35C",
          dark: "#A8721F",
        },
        flare: {
          DEFAULT: "#FF6B35",
          light: "#FF8F5E",
          dark: "#C94A1E",
        },
        chalk: {
          DEFAULT: "#EDE6D9",
          dim: "#E1D8C6",
        },
        ink: {
          high: "#F3EDE2",
          muted: "#A79C8C",
          soft: "#6E6459",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        body: ["var(--font-body)", "serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      backgroundImage: {
        "contour": "url('/contour.svg')",
      },
      keyframes: {
        drift: {
          "0%": { transform: "translateY(0) translateX(0)" },
          "100%": { transform: "translateY(-40px) translateX(20px)" },
        },
        rise: {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        ticker: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        pulseGauge: {
          "0%,100%": { opacity: "0.55" },
          "50%": { opacity: "1" },
        },
        pumpjack: {
          "0%, 100%": { transform: "rotate(-16deg)" },
          "50%": { transform: "rotate(16deg)" },
        },
        counterweight: {
          "0%, 100%": { transform: "translateY(-6px)" },
          "50%": { transform: "translateY(6px)" },
        },
        flicker: {
          "0%, 100%": { transform: "scaleY(1) scaleX(1)", opacity: "1" },
          "25%": { transform: "scaleY(1.12) scaleX(0.95)", opacity: "0.92" },
          "50%": { transform: "scaleY(0.92) scaleX(1.05)", opacity: "1" },
          "75%": { transform: "scaleY(1.08) scaleX(0.97)", opacity: "0.9" },
        },
        glow: {
          "0%, 100%": { opacity: "0.5", filter: "blur(18px)" },
          "50%": { opacity: "0.85", filter: "blur(24px)" },
        },
        smoke: {
          "0%": { transform: "translateY(0) scale(1)", opacity: "0.35" },
          "100%": { transform: "translateY(-60px) scale(1.6)", opacity: "0" },
        },
        twinkle: {
          "0%, 100%": { opacity: "0.3" },
          "50%": { opacity: "1" },
        },
        grain: {
          "0%, 100%": { transform: "translate(0,0)" },
          "50%": { transform: "translate(-2%,2%)" },
        },
      },
      animation: {
        drift: "drift 18s ease-in-out infinite alternate",
        rise: "rise 0.7s cubic-bezier(0.16,1,0.3,1) both",
        ticker: "ticker 40s linear infinite",
        pulseGauge: "pulseGauge 3s ease-in-out infinite",
        pumpjack: "pumpjack 2.6s ease-in-out infinite",
        counterweight: "counterweight 2.6s ease-in-out infinite",
        flicker: "flicker 0.6s ease-in-out infinite",
        glow: "glow 2.4s ease-in-out infinite",
        smoke: "smoke 4s ease-out infinite",
        twinkle: "twinkle 3s ease-in-out infinite",
        grain: "grain 8s steps(8) infinite",
      },
    },
  },
  plugins: [],
};
export default config;

