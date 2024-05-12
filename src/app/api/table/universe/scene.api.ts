import { ApiHandler } from "@/common/utils/api.util";
import { supabase } from "@supabase/client";
import { TablesInsert } from "@supabase/database.type";

export type Scene_SearchParams_SearchParams = {
  universe_id: string;
  episode_id?: string;
  event_ids?: string[];
};

class SceneApi extends ApiHandler<"scenes", "id" | "universe_id", Scene_SearchParams_SearchParams> {
  constructor() {
    super(supabase, {
      tableName: "scenes",
      primaryKeys: ["id", "universe_id"],
      uniqueKeys: ["id", "universe_id"],
      handlers: [
        (prev, params) => {
          prev.eq("universe_id", params.universe_id);
          if (params.episode_id) {
            prev.eq("episode_id", params.episode_id);
          }
          if (params.event_ids) {
            prev.in("event_id", params.event_ids);
          }
          return prev;
        },
      ],
    });
  }
  emptyReq(universe_id: string, episode_id: string, event_id: string): TablesInsert<"scenes"> {
    return {
      episode_id,
      event_id,
      universe_id: universe_id,
    };
  }
}

export const sceneApi: SceneApi = new SceneApi();
