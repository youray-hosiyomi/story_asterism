import { EnumHandler } from "./enum.util";

export type ThemeColor = "primary" | "info" | "success" | "warning" | "error" | "neutral";

export class ThemeColorEnum extends EnumHandler<ThemeColor> {
  constructor() {
    super({
      options: [
        {
          value: "primary",
          label: "Primary",
        },
        {
          value: "info",
          label: "Info",
        },
        {
          value: "success",
          label: "Success",
        },
        {
          value: "warning",
          label: "Warning",
        },
        {
          value: "error",
          label: "Error",
        },
        {
          value: "neutral",
          label: "Neutral",
        },
      ],
      defaultKind: "neutral",
    });
  }
}
export const themeColorEnum = new ThemeColorEnum();
