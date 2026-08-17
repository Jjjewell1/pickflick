import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        theater: {
          red: "#C41E3A",
          "red-dark": "#9B1830",
          gold: "#F5C518",
          "gold-dark": "#D4A810",
          warm: "#1A0A0A",
        },
        glass: {
          light: "rgba(255, 255, 255, 0.08)",
          medium: "rgba(255, 255, 255, 0.12)",
          heavy: "rgba(255, 255, 255, 0.18)",
          border: "rgba(255, 255, 255, 0.15)",
        },
      },
      fontFamily: {
        display: [
          "Georgia",
          "Cambria",
          '"Times New Roman"',
          "Times",
          "serif",
        ],
        body: [
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          '"Segoe UI"',
          "Roboto",
          "sans-serif",
        ],
      },
      animation: {
        "float-kernel": "floatKernel 8s ease-in-out infinite",
        "float-kernel-slow": "floatKernel 12s ease-in-out infinite",
        "float-kernel-fast": "floatKernel 6s ease-in-out infinite",
        "pulse-glow": "pulseGlow 2s ease-in-out infinite",
        "spin-wheel": "spinWheel 3s cubic-bezier(0.17, 0.67, 0.12, 0.99)",
        "scale-in": "scaleIn 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)",
        "fade-in-up": "fadeInUp 0.5s ease-out",
        "confetti-fall": "confettiFall 2s ease-out forwards",
        "card-shuffle": "cardShuffle 0.12s ease-in-out",
        "card-deal": "cardDeal 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
        "card-flip-in": "cardFlipIn 0.5s ease-out forwards",
        "card-wobble": "cardWobble 0.5s ease-in-out",
        "deal-slide": "dealSlide 0.4s cubic-bezier(0.22, 1, 0.36, 1) forwards",
        "stack-settle": "stackSettle 0.3s ease-out",
      },
      keyframes: {
        floatKernel: {
          "0%, 100%": { transform: "translateY(0) rotate(0deg)", opacity: "0.3" },
          "50%": { transform: "translateY(-20px) rotate(15deg)", opacity: "0.6" },
        },
        pulseGlow: {
          "0%, 100%": { boxShadow: "0 0 20px rgba(196, 30, 58, 0.3)" },
          "50%": { boxShadow: "0 0 40px rgba(196, 30, 58, 0.6)" },
        },
        scaleIn: {
          "0%": { transform: "scale(0.5)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        fadeInUp: {
          "0%": { transform: "translateY(30px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        confettiFall: {
          "0%": { transform: "translateY(-100vh) rotate(0deg)", opacity: "1" },
          "100%": { transform: "translateY(100vh) rotate(720deg)", opacity: "0" },
        },
        cardShuffle: {
          "0%": { transform: "translateY(0) rotate(0deg)" },
          "50%": { transform: "translateY(-8px) rotate(-2deg) scale(1.02)" },
          "100%": { transform: "translateY(0) rotate(0deg)" },
        },
        cardDeal: {
          "0%": { transform: "translateY(0) scale(1)" },
          "60%": { transform: "translateY(-60px) scale(1.05)" },
          "100%": { transform: "translateY(-30px) scale(1.08)" },
        },
        cardFlipIn: {
          "0%": { transform: "perspective(800px) rotateY(90deg) scale(0.8)", opacity: "0" },
          "100%": { transform: "perspective(800px) rotateY(0deg) scale(1)", opacity: "1" },
        },
        cardWobble: {
          "0%, 100%": { transform: "rotate(0deg)" },
          "25%": { transform: "rotate(-3deg)" },
          "75%": { transform: "rotate(3deg)" },
        },
        dealSlide: {
          "0%": { transform: "translateY(0) rotate(0deg) scale(1)", opacity: "1" },
          "100%": { transform: "translateY(-120px) rotate(-5deg) scale(1.1)", opacity: "0" },
        },
        stackSettle: {
          "0%": { transform: "translateY(-4px)" },
          "100%": { transform: "translateY(0)" },
        },
      },
      backdropBlur: {
        xs: "2px",
      },
    },
  },
  plugins: [],
};
export default config;
