import { ApiHandler, PrimaryParams } from "@/common/utils/api.util";
import { supabase } from "@supabase/client";
import { Tables, TablesInsert } from "@supabase/database.type";
import { episodeOrderApi } from "./episode.order.api";
import { makeUUID } from "@/common/utils/uid.util";

export type Episode_SearchParams = {
  ids?: string[];
  universe_id: string;
};

class EpisodeApi extends ApiHandler<"episodes", "id" | "universe_id", Episode_SearchParams> {
  constructor() {
    super(supabase, {
      tableName: "episodes",
      primaryKeys: ["id", "universe_id"],
      uniqueKeys: ["id", "universe_id"],
      handlers: [
        (prev, params) => {
          prev.eq("universe_id", params.universe_id);
          if (params.ids) {
            prev.in("id", params.ids);
          }
          return prev;
        },
      ],
    });
  }
  override async insert(req: TablesInsert<"episodes">) {
    req = {
      ...req,
      id: req.id ?? makeUUID(),
    };
    const order = await episodeOrderApi.find({ universe_id: req.universe_id });
    const orderReq = order ?? episodeOrderApi.emptyReq(req.universe_id);
    await episodeOrderApi.upsert({
      ...orderReq,
      episode_id_list: orderReq.episode_id_list.concat(req.id ? [req.id] : []),
    });
    return await super.insert(req);
  }
  override async upsert(req: TablesInsert<"episodes">) {
    req = {
      ...req,
      id: req.id ?? makeUUID(),
    };
    const order = await episodeOrderApi.find({ universe_id: req.universe_id });
    const orderReq = order ?? episodeOrderApi.emptyReq(req.universe_id);
    await episodeOrderApi.upsert({
      ...orderReq,
      episode_id_list: orderReq.episode_id_list.concat(req.id ? [req.id] : []),
    });
    return await super.upsert(req);
  }
  override async delete(primaryParams: PrimaryParams<"episodes", "id" | "universe_id">) {
    const order = await episodeOrderApi.find({ universe_id: primaryParams.universe_id });
    const orderReq = order ?? episodeOrderApi.emptyReq(primaryParams.universe_id);
    await episodeOrderApi.upsert({
      ...orderReq,
      episode_id_list: orderReq.episode_id_list.filter((id) => id !== primaryParams.id),
    });
    return await super.delete(primaryParams);
  }
  override async list(searchParams: Episode_SearchParams): Promise<Tables<"episodes">[]> {
    const order = await episodeOrderApi.find({ universe_id: searchParams.universe_id });
    const ids: string[] = order?.episode_id_list ?? [];
    const list = await super.list(searchParams);
    return list.sort((a, b) => {
      const aSeq = ids.indexOf(a.id);
      const bSeq = ids.indexOf(b.id);
      if (aSeq < bSeq) return -1;
      if (aSeq > bSeq) return 1;
      return 0;
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
