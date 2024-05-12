import { EnumHandler } from "@/common/utils/enum.util";

export type EpisodePartNoKind = "1" | "2" | "3" | "4";

export class EpisodePartNoEnum extends EnumHandler<EpisodePartNoKind> {
  constructor() {
    super({
      options: [
        {
          value: "1",
          label: "起",
        },
        {
          value: "2",
          label: "承",
        },
        {
          value: "3",
          label: "転",
        },
        {
          value: "4",
          label: "結",
        },
      ],
      defaultKind: "1",
    });
  }
}

export const episodePartNoEnum: EpisodePartNoEnum = new EpisodePartNoEnum();
