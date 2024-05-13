import type { Config } from "tailwindcss";
import daisyuiColorObj from "daisyui/src/theming/themes";
import { Theme } from "daisyui/src/index";

const baseTheme: Theme = "light";

const config = {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: daisyuiColorObj[baseTheme]["base-content"],
        input: daisyuiColorObj[baseTheme]["base-content"],
        ring: daisyuiColorObj[baseTheme]["base-content"],
        background: daisyuiColorObj[baseTheme]["base-100"],
        foreground: daisyuiColorObj[baseTheme]["base-content"],
        primary: {
          DEFAULT: daisyuiColorObj[baseTheme]["primary"],
          foreground: daisyuiColorObj[baseTheme]["primary-content"],
        },
        secondary: {
          DEFAULT: daisyuiColorObj[baseTheme]["secondary"],
          foreground: daisyuiColorObj[baseTheme]["secondary-content"],
        },
        destructive: {
          DEFAULT: daisyuiColorObj[baseTheme]["error"],
          foreground: daisyuiColorObj[baseTheme]["error-content"],
        },
        muted: {
          DEFAULT: daisyuiColorObj[baseTheme]["base-300"],
          foreground: daisyuiColorObj[baseTheme]["base-content"],
        },
        accent: {
          DEFAULT: daisyuiColorObj[baseTheme]["accent"],
          foreground: daisyuiColorObj[baseTheme]["accent-content"],
        },
        popover: {
          DEFAULT: daisyuiColorObj[baseTheme]["base-100"],
          foreground: daisyuiColorObj[baseTheme]["base-content"],
        },
        card: {
          DEFAULT: daisyuiColorObj[baseTheme]["base-100"],
          foreground: daisyuiColorObj[baseTheme]["base-content"],
        },
      },
      borderRadius: {
        lg: "var(--rounded-btn)",
        md: "calc(var(--rounded-btn) - 2px)",
        sm: "calc(var(--rounded-btn) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;

export default config;
