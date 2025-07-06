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
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
