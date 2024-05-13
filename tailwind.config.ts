import { Config } from "tailwindcss";
import daisyui, { Config as DaisyUIConfig } from "daisyui";
import shadcnConfig from "./shadcn/tailwind.config";

export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}", "./shadcn/**/*.{js,jsx,ts,tsx}"],
  theme: {
    container: shadcnConfig.theme.container,
    extend: {
      ...shadcnConfig.theme.extend,
      animation: {
        ...shadcnConfig.theme.extend.animation,
        "fadein-up": "fadein-up 0.2s ease-out forwards",
        fadein: "fadein 0.2s ease-out forwards",
      },
      keyframes: {
        ...shadcnConfig.theme.extend.keyframes,
        "fadein-up": {
          "0%": {
            opacity: "0",
            transform: "translateY(7px)",
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0)",
          },
        },
        fadein: {
          "0%": {
            opacity: "0",
          },
          "100%": {
            opacity: "1",
          },
        },
      },
    },
  },
  plugins: [daisyui, ...shadcnConfig.plugins],
  daisyui: {
    themes: ["light"],
  },
} as Config & {
  daisyui?: DaisyUIConfig;
};
