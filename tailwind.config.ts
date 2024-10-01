import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  safelist: ["bg-red-500", "bg-blue-500", "bg-green-500", "bg-yellow-500"],
  theme: {
    extend: {
      colors: {
        yellow: "#f9c74f",
        green: "#43aa8b",
        blue: "#577590",
        red: "#f94144",
      },
    },
  },
  plugins: [],
};
export default config;
