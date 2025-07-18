import type { Config } from "tailwindcss";

export default {
  content: [
    "./node_modules/primereact/**/*.{js,ts,jsx,tsx}",
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        gray: {
          25: "#fdfdfd",
          50: "#fafafa",
          100: "#f5f5f5",
          200: "#e8eaec",
          300: "#d5d7db",
          400: "#a5a7ad",
          500: "#707680",
          600: "#525862",
          700: "#414651",
          800: "#262b36",
          900: "#181e27",
        },
        blue: {
          25: "#f5faff",
          50: "#eff8ff",
          100: "#d1e9ff",
          200: "#b2ddff",
          300: "#84caff",
          400: "#53b1fd",
          500: "#2e90fa",
          600: "#1570ef",
          700: "#175cd3",
          800: "#1849a9",
          900: "#194185",
        },
        background: "var(--background)",
        foreground: "var(--foreground)",
        border: "var(--border)",
        primary: {
          light: "var(--primary-light)",
          dark: "var(--primary-dark)",
        },
        text: {
          lighter: "var(--text-lighter)",
          light: "var(--text-light)",
          dark: "var(--text-dark)",
          darker: "var(--text-darker)",
        },
      },
      fontFamily: {
        inter: ["Inter", "ui-sans-serif", "system-ui"],
      },
      boxShadow: {
        xs: "0 2px 2px 0 rgba(10, 13, 18, 0.05)",
        lg: "0 12px 16px -4px rgba(10, 13, 18, 0.08)",
      },
    },
  },
  plugins: [],
} satisfies Config;
