import { OptionItem } from "../type/option-item.type";
import { singleStock } from "./stocker.util";

export type EnumHandlerConfig<Kind> = {
  options: OptionItem<Kind>[];
  defaultKind: Kind;
};

export class EnumHandler<Kind extends string> {
  values: Kind[];
  options: OptionItem<Kind>[];
  kindRecord: Record<string, Kind>;
  defaultKind: Kind;
  constructor(c: EnumHandlerConfig<Kind>) {
    this.options = c.options;
    this.values = c.options.map((o) => o.value);
    this.kindRecord = singleStock<Kind>((s) => s)
      .setAll(c.options.map((o) => o.value))
      .getRecord();
    this.defaultKind = c.defaultKind;
  }
  get(str: string | null | undefined): Kind {
    if (!str) {
      return this.defaultKind;
    }
    return this.kindRecord[str] ?? this.defaultKind;
  }
  getOption(str: Kind | string | null | undefined): OptionItem<Kind> | null {
    if (!str) {
      return null;
    }
    return this.options.find((o) => o.value == this.kindRecord[str]) ?? null;
  }
}
