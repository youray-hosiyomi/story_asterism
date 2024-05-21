import { ApiHandler, PrimaryParams } from "@/common/utils/api.util";
import { supabase } from "@supabase/client";
import { Tables, TablesInsert } from "@supabase/database.type";
import { sceneOrderApi } from "./scene.order.api";
import { makeUUID } from "@/common/utils/uid.util";
import { singleStock } from "@/common/utils/stocker.util";

export type Scene_SearchParams = {
  universe_id: string;
  episode_id?: string;
  event_ids?: string[];
};

class SceneApi extends ApiHandler<"scenes", "id" | "universe_id", Scene_SearchParams> {
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
  override async insert(req: TablesInsert<"scenes">) {
    req = {
      ...req,
      id: req.id ?? makeUUID(),
    };
    const order = await sceneOrderApi.find({ universe_id: req.universe_id, episode_id: req.episode_id });
    const orderReq = order ?? sceneOrderApi.emptyReq(req.universe_id, req.episode_id);
    await sceneOrderApi.upsert({
      ...orderReq,
      scene_id_list: orderReq.scene_id_list.concat(req.id ? [req.id] : []),
    });
    return await super.insert(req);
  }
  override async upsert(req: TablesInsert<"scenes">) {
    req = {
      ...req,
      id: req.id ?? makeUUID(),
    };
    const order = await sceneOrderApi.find({ universe_id: req.universe_id, episode_id: req.episode_id });
    const orderReq = order ?? sceneOrderApi.emptyReq(req.universe_id, req.episode_id);
    await sceneOrderApi.upsert({
      ...orderReq,
      scene_id_list: orderReq.scene_id_list.concat(req.id ? [req.id] : []),
    });
    return await super.upsert(req);
  }
  override async delete(primaryParams: PrimaryParams<"scenes", "id" | "universe_id" | "episode_id">) {
    const order = await sceneOrderApi.find({
      universe_id: primaryParams.universe_id,
      episode_id: primaryParams.episode_id,
    });
    const orderReq = order ?? sceneOrderApi.emptyReq(primaryParams.universe_id, primaryParams.episode_id);
    await sceneOrderApi.upsert({
      ...orderReq,
      scene_id_list: orderReq.scene_id_list.filter((id) => id !== primaryParams.id),
    });
    return await super.delete(primaryParams);
  }
  override async list(searchParams: Scene_SearchParams): Promise<Tables<"scenes">[]> {
    const orders = await sceneOrderApi.list({
      universe_id: searchParams.universe_id,
    });
    const idsStocker = singleStock<Tables<"scene$orders">>((o) => o.episode_id).setAll(orders);
    const list = await super.list(searchParams);
    return list.sort((a, b) => {
      const aSeq = idsStocker.get(a.episode_id)?.scene_id_list.indexOf(a.id) ?? -1;
      const bSeq = idsStocker.get(b.episode_id)?.scene_id_list.indexOf(b.id) ?? -1;
      if (aSeq < bSeq) return -1;
      if (aSeq > bSeq) return 1;
      return 0;
    });
  }
  emptyReq(universe_id: string, episode_id: string, event_id: string | null = null): TablesInsert<"scenes"> {
    return {
      name: "",
      episode_id,
      event_id,
      universe_id: universe_id,
    };
  }
}

export const sceneApi: SceneApi = new SceneApi();
