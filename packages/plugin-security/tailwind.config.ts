import type { Config } from "tailwindcss";
export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{ts,tsx}", "./node_modules/@codeexpander/dev-tools-ui/src/**/*.{ts,tsx}"],
  theme: { extend: { colors: { border: "hsl(var(--border))", input: "hsl(var(--input))", ring: "hsl(var(--ring))", background: "hsl(var(--background))", foreground: "hsl(var(--foreground))", primary: { DEFAULT: "hsl(var(--primary))", foreground: "hsl(var(--primary-foreground))" }, card: { DEFAULT: "hsl(var(--card))", foreground: "hsl(var(--card-foreground))" } }, borderRadius: { lg: "var(--radius)", md: "calc(var(--radius) - 2px)" } } },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
