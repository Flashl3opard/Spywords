import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      boxShadow: {
        glow: "0 0 25px rgba(255,255,255,0.25)",
      },
      backgroundImage: {
        aurora:
          "radial-gradient(circle at 20% 20%, rgba(99,102,241,0.35), transparent 45%), radial-gradient(circle at 80% 0%, rgba(236,72,153,0.30), transparent 35%), radial-gradient(circle at 70% 80%, rgba(14,165,233,0.3), transparent 40%)",
      },
    },
  },
  plugins: [],
};

export default config;
