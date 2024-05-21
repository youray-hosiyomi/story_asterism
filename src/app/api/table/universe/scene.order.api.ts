import { ApiHandler } from "@/common/utils/api.util";
import { supabase } from "@supabase/client";
import { TablesInsert } from "@supabase/database.type";

export type Scene_Order_SearchParams = {
  universe_id: string;
};

class SceneOrderApi extends ApiHandler<"scene$orders", "universe_id" | "episode_id", Scene_Order_SearchParams> {
  constructor() {
    super(supabase, {
      tableName: "scene$orders",
      primaryKeys: ["universe_id", "episode_id"],
      uniqueKeys: ["universe_id", "episode_id"],
      handlers: [
        (prev, params) => {
          prev.eq("universe_id", params.universe_id);
          return prev;
        },
      ],
    });
  }
  emptyReq(universe_id: string, episode_id: string): TablesInsert<"scene$orders"> {
    return {
      episode_id,
      universe_id,
      scene_id_list: [],
    };
  }
}

export const sceneOrderApi: SceneOrderApi = new SceneOrderApi();
