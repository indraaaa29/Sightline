import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#17211F",
        deep: "#10242B",
        paper: "#F7F6F2",
        slate: "#52616B",
        signal: {
          DEFAULT: "#A67C3A",
          hover: "#8B6730",
          light: "#F3EBDD",
        },
        line: "#D8DCD9",
        panel: "#EFEBE3",
        warm: "#E9E5DC",
        success: "#356B52",
        error: "#9B3A32",
        white: "#FFFFFF",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "-apple-system", "sans-serif"],
        serif: ["var(--font-source-serif)", "Georgia", "serif"],
      },
      fontSize: {
        "display": ["72px", { lineHeight: "1.05", letterSpacing: "-0.02em", fontWeight: "600" }],
        "h1-desktop": ["56px", { lineHeight: "1.08", letterSpacing: "-0.015em", fontWeight: "600" }],
        "h2-desktop": ["40px", { lineHeight: "1.15", letterSpacing: "-0.01em", fontWeight: "600" }],
        "h3-desktop": ["24px", { lineHeight: "1.3", letterSpacing: "0", fontWeight: "600" }],
        "body-large-desktop": ["18px", { lineHeight: "1.6", letterSpacing: "0", fontWeight: "400" }],
        "body-regular-desktop": ["16px", { lineHeight: "1.6", letterSpacing: "0", fontWeight: "400" }],
        "h1-mobile": ["40px", { lineHeight: "1.08", letterSpacing: "-0.01em", fontWeight: "600" }],
        "h2-mobile": ["30px", { lineHeight: "1.15", letterSpacing: "-0.01em", fontWeight: "600" }],
        "h3-mobile": ["20px", { lineHeight: "1.3", letterSpacing: "0", fontWeight: "600" }],
        "body-large-mobile": ["17px", { lineHeight: "1.6", letterSpacing: "0", fontWeight: "400" }],
        "body-regular-mobile": ["16px", { lineHeight: "1.6", letterSpacing: "0", fontWeight: "400" }],
        "caption": ["13px", { lineHeight: "1.4", letterSpacing: "0.01em", fontWeight: "500" }],
        "button": ["15px", { lineHeight: "1", letterSpacing: "0.01em", fontWeight: "600" }],
        "eyebrow": ["12px", { lineHeight: "1.4", letterSpacing: "0.1em", fontWeight: "600" }],
      },
      boxShadow: {
        card: "0 1px 3px 0 rgba(16, 36, 43, 0.06), 0 1px 2px -1px rgba(16, 36, 43, 0.06)",
        elevated: "0 4px 16px 0 rgba(16, 36, 43, 0.08), 0 1px 4px -1px rgba(16, 36, 43, 0.04)",
      },
      borderRadius: {
        "4": "4px",
        "6": "6px",
        "8": "8px",
        "12": "12px",
        "16": "16px",
      },
      animation: {
        marquee: 'marquee 30s linear infinite',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        }
      }
    },
  },
  plugins: [],
};
export default config;
