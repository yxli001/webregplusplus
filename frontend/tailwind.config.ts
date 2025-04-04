import type { Config } from "tailwindcss";

export default {
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
        border: "var(--border)",
        primary: {
          light: "var(--primary)",
          dark: "var(--primary-dark)",
        },
        text: {
          light: "var(--text-light)",
          dark: "var(--text-dark)",
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
