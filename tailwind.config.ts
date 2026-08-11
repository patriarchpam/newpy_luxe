import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        noir: "#0F0E11",
        ink: "#171717",
        charcoal: "#1C1A20",
        smoke: "#2A272F",
        ash: "#6E6A75",
        mist: "#B8B4BF",
        cloud: "#F4F3F6",
        plum: {
          50: "#F6F1FA",
          100: "#EADFF3",
          200: "#D6BFE7",
          300: "#B994D3",
          400: "#9A6BBE",
          500: "#7C46A6",
          600: "#63348A",
          700: "#4B276A",
          800: "#331A49",
          900: "#1F0F2D",
        },
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', "Georgia", "serif"],
        sans: ["Jost", "Inter", "system-ui", "sans-serif"],
      },
      spacing: {
        13: "3.25rem",
      },
      boxShadow: {
        soft: "0 12px 40px -12px rgba(15, 14, 17, 0.35)",
        glow: "0 0 0 1px rgba(154, 107, 190, 0.35)",
      },
      borderRadius: {
        "4xl": "2rem",
      },
      animation: {
        "fade-in": "fadeIn 0.6s ease-out forwards",
        "slide-up": "slideUp 0.6s ease-out forwards",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
