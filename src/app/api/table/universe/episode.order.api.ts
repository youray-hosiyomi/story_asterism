import { ApiHandler } from "@/common/utils/api.util";
import { supabase } from "@supabase/client";
import { TablesInsert } from "@supabase/database.type";

export type Episode_Order_SearchParams = {
  universe_id: string;
};

class EpisodeOrderApi extends ApiHandler<"episode$orders", "universe_id", Episode_Order_SearchParams> {
  constructor() {
    super(supabase, {
      tableName: "episode$orders",
      primaryKeys: ["universe_id"],
      uniqueKeys: ["universe_id"],
      handlers: [
        (prev, params) => {
          prev.eq("universe_id", params.universe_id);
          return prev;
        },
      ],
    });
  }
  emptyReq(universe_id: string): TablesInsert<"episode$orders"> {
    return {
      universe_id: universe_id,
      episode_id_list: [],
    };
  }
}

export const episodeOrderApi: EpisodeOrderApi = new EpisodeOrderApi();
