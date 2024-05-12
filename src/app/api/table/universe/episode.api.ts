import { ApiHandler } from "@/common/utils/api.util";
import { supabase } from "@supabase/client";
import { TablesInsert } from "@supabase/database.type";

export type Episode_SearchParams = {
  ids?: string[];
  universe_id: string;
};

class EpisodeApi extends ApiHandler<"episodes", "id" | "universe_id", Episode_SearchParams, "seq" | "universe_id"> {
  constructor() {
    super(supabase, {
      tableName: "episodes",
      primaryKeys: ["id", "universe_id"],
      uniqueKeys: ["seq", "universe_id"],
      handlers: [
        (prev, params) => {
          prev.eq("universe_id", params.universe_id);
          if (params.ids) {
            prev.in("id", params.ids);
          }
          return prev.order("seq", { ascending: true });
        },
      ],
    });
  }
  emptyReq(universe_id: string): TablesInsert<"episodes"> {
    return {
      title: "",
      universe_id: universe_id,
    };
  }
}

export const episodeApi: EpisodeApi = new EpisodeApi();
